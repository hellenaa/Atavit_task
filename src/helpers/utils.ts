import moment from "moment";

class Utils {
  private moment;
  constructor() {
    this.moment = moment;
  }

  public formatDate(date: string): string {
    return  moment(date).format("DD-MM-YYYY");
  }
}

export default new Utils();
