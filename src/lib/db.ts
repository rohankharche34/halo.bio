const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
}

async function supabaseFetch(table: string, options: {
  method?: string;
  body?: any;
  params?: Record<string, string>;
} = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in environment variables.");
  }
  
  const { method = "GET", body, params } = options;
  
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  }

  const headers: Record<string, string> = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": method === "POST" || method === "PUT" || method === "PATCH" 
      ? "return=representation" 
      : "return=minimal",
    "Cache-Control": "no-cache",
  };

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Supabase error:", res.status, err);
    return { data: null, error: err };
  }

  const data = await res.json();
  return { data, error: null };
}

class Statement {
  private sql: string;
  private params: any[] = [];

  constructor(sql: string) {
    this.sql = sql;
  }

  async run(...params: any[]) {
    this.params = params;
    return await this.exec();
  }

  async get(...params: any[]) {
    this.params = params;
    return await this.queryOne();
  }

  async all(...params: any[]) {
    this.params = params;
    return await this.queryMany();
  }

  private parseTable(): string {
    const sql = this.sql.toLowerCase();
    const fromMatch = sql.match(/from\s+(\w+)/);
    const intoMatch = sql.match(/into\s+(\w+)/);
    const updateMatch = sql.match(/update\s+(\w+)/);
    return fromMatch?.[1] || intoMatch?.[1] || updateMatch?.[1] || "";
  }

  private parseWhere(): { field: string; value: any } | null {
    const whereMatch = this.sql.match(/where\s+(\w+)\s*=\s*\?/i);
    if (whereMatch && this.params.length > 0) {
      const setMatch = this.sql.match(/set\s+(.+?)\s+where/i);
      let paramIndex = 0;
      if (setMatch) {
        const setPart = setMatch[1];
        paramIndex = (setPart.match(/\?/g) || []).length;
      }
      const field = whereMatch[1];
      const isUpperCase = field[0] === field[0].toUpperCase();
      return { field: isUpperCase ? field : field.toLowerCase(), value: this.params[paramIndex] };
    }
    return null;
  }

  private getOrderBy(): { field: string; ascending: boolean } | null {
    const match = this.sql.match(/order\s+by\s+(\w+)(?:\s+(asc|desc))?/i);
    if (match) {
      const field = match[1];
      const isUpperCase = field[0] === field[0].toUpperCase();
      return { field: isUpperCase ? field : field.toLowerCase(), ascending: (match[2] || "asc").toLowerCase() === "asc" };
    }
    return null;
  }

  private getLimit(): number | null {
    const match = this.sql.match(/limit\s+(\d+|\?)/i);
    if (match) {
      return match[1] === "?" ? this.params[this.params.length - 1] : parseInt(match[1]);
    }
    return null;
  }

  private getInsertData(): Record<string, any> | null {
    const match = this.sql.match(/\(([^)]+)\)\s*values\s*\(([^)]+)\)/i);
    if (!match) return null;

    const fields = match[1].split(",").map((f: string) => f.trim());
    const values = this.params;

    const data: Record<string, any> = {};
    fields.forEach((field: string, i: number) => {
      data[field] = values[i];
    });
    return data;
  }

  private getUpdateData(): Record<string, any> | null {
    const match = this.sql.match(/set\s+(.+?)\s+where/i);
    if (!match) return null;

    const setPart = match[1];
    const assignments = setPart.split(",").map((s: string) => s.trim());
    
    const data: Record<string, any> = {};
    let paramIdx = 0;
    
    for (const assignment of assignments) {
      if (assignment.includes("=")) {
        const [field] = assignment.split("=").map(s => s.trim());
        data[field] = this.params[paramIdx];
        paramIdx++;
      }
    }
    return data;
  }

  private async exec() {
    const sql = this.sql.toLowerCase();
    const table = this.parseTable();
    const where = this.parseWhere();

    if (sql.startsWith("insert")) {
      const data = this.getInsertData();
      const result = await supabaseFetch(table, { method: "POST", body: data });
      return { changes: 1, lastInsertRowid: result.data?.[0]?.id };
    }

    if (sql.startsWith("update")) {
      const data = this.getUpdateData();
      const params: Record<string, string> = {};
      if (where) {
        params[where.field] = `eq.${where.value}`;
      }
      await supabaseFetch(table, { method: "PATCH", body: data, params });
      return { changes: 1 };
    }

    if (sql.startsWith("alter table")) {
      return { changes: 0 };
    }

    return { changes: 0 };
  }

  private toCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.toCamelCase(item));
    }
    if (obj && typeof obj === "object") {
      const result: any = {};
      for (const key in obj) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        result[camelKey] = this.toCamelCase(obj[key]);
      }
      return result;
    }
    return obj;
  }

  private async queryOne() {
    const table = this.parseTable();
    const where = this.parseWhere();
    const orderBy = this.getOrderBy();
    const limit = this.getLimit();

    const params: Record<string, string> = {};
    if (where) {
      params[where.field] = `eq.${where.value}`;
    }
    if (orderBy) {
      params.order = `${orderBy.field}.${orderBy.ascending ? "asc" : "desc"}`;
    }
    if (limit) {
      params.limit = limit.toString();
    }

    const { data, error } = await supabaseFetch(table, { params });
    
    if (error) return null;
    const result = Array.isArray(data) ? data[0] || null : data;
    return this.toCamelCase(result);
  }

  private async queryMany() {
    const table = this.parseTable();
    const where = this.parseWhere();
    const orderBy = this.getOrderBy();
    const limit = this.getLimit();

    const params: Record<string, string> = {};
    if (where) {
      params[where.field] = `eq.${where.value}`;
    }
    if (orderBy) {
      params.order = `${orderBy.field}.${orderBy.ascending ? "asc" : "desc"}`;
    }
    if (limit) {
      params.limit = limit.toString();
    }

    const { data, error } = await supabaseFetch(table, { params });
    
    if (error) return [];
    return this.toCamelCase(data || []);
  }
}

class Database {
  prepare(sql: string) {
    return new Statement(sql);
  }

  exec(sql: string) {
    const stmt = this.prepare(sql);
    return stmt.run();
  }
}

const db = new Database();
export default db;
