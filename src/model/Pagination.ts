export class Pagination {
    page: number;
    limit: number;
    total: number;
  
    constructor(page: number = 1, limit: number = 10, total: number = 0) {
      this.page = page;
      this.limit = limit;
      this.total = total;
    }
  
    getTotalPages(): number {
      return Math.ceil(this.total / this.limit);
    }
  
    hasPrev(): boolean {
      return this.page > 1;
    }
  
    hasNext(): boolean {
      return this.page < this.getTotalPages();
    }
  
    update(page: number, limit: number, total: number) {
      this.page = page;
      this.limit = limit;
      this.total = total;
    }
  }
  