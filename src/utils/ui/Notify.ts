import { toast } from 'react-toastify'

export class Notify {
  static success( msg : string ) {
    toast.success(msg);
  }
  static error( msg : string ) {
    toast.error(msg);
  }
  static info( msg : string ) {
    toast.info(msg);
  }
}
