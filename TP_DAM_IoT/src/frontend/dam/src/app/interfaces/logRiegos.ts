export class Logs {
    constructor(
      private _logRiegoId: number,
      private _apertura: number,
      private _fecha: Date,
      private _electrovalvulaId: number
    ) {}
  
    get logRiegoId(): number {
      return this._logRiegoId;
    }
    set logRiegoId(value: number) {
      this._logRiegoId = value;
    }
    get fecha(): Date {
      return this._fecha;
    }
    set fecha(value: Date) {
      this._fecha = value;
    }
      get apertura(): number {
      return this._apertura;
    }
    set apertura(value: number) {
      this._apertura = value;
    }
    get electrovalvulaId(): number {
      return this._electrovalvulaId;
    }
    set electrovalvulaId(value: number) {
      this._electrovalvulaId = value;
    }
  }