import data from "./data.json";
const max = 8;
const extension = ".svg";

interface Row {
  id: number;
  item: string;
  image: string;
}

class CategoryModule {
  constructor(
    public readonly rows: Row[] = [...Array(max)].map((_, id) => {
      const imageName = ("0" + (id + 1)).slice(-2);
      const image = require(`./${imageName}${extension}`);
      const row: Row = {
        id,
        image: String(image),
        item: String(data[id]),
      };
      return row;
    })
  ) // public readonly rows: Row[] = data.map((item, id) => ({ id, item })),
  {}

  findById(id: number): Row | undefined {
    return this.rows.find((row) => row.id === id);
  }
}

export default new CategoryModule();