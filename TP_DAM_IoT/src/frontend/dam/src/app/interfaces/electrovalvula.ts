export class Electrovalvula {
    constructor(
      private _evId: number,
      private _nombre: string,
      private _apertura: number
    ) {}
  
    get evId(): number {
      return this._evId;
    }
    set evId(value: number) {
      this._evId = value;
    }
    get nombre(): string {
      return this._nombre;
    }
    set nombre(value: string) {
      this._nombre = value;
    }
    get apertura(): number {
      return this._apertura;
    }
    set apertura(value: number) {
      this._apertura = value;
    }
  }
