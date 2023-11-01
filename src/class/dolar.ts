class Dolar {
  private lastAvg: number;

  constructor() {
    this.lastAvg = 0;
  }

  public setLastAvg = (lastAvg: number) => {
    this.lastAvg = lastAvg;
  };

  public getLastAvg = () => this.lastAvg;
}

const dolar = new Dolar();

export default dolar;
