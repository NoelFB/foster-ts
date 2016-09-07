/// <reference path="./../component.ts"/>

class Sound extends Component {
  private audio : any;
  private audioFile : string;
  private isInitialized : boolean = false;

  constructor(fileName : string)
  {
    super();
    this.audioFile = fileName;
  }

  public initialize() {
    this.audio = new Audio(this.audioFile);
    this.isInitialized = true;
  }


  public play() : void
  {
    if (!this.isInitialized) {
      // maybe just initialize here and eat the delay?
      return;
    }
    this.audio.play();
  }
}
