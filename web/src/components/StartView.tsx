import * as React from "react";
import { Redirect } from "react-router";
import { Environment } from "../environment";
import "./StartView.css";

export interface Props {}

type State = {
  activationCode: string;
  redirect: boolean;
};

class StartView extends React.Component<Props, State> {
  public readonly state: State = {
    activationCode: "",
    redirect: false,
  };

  componentDidMount() {
    document.title = "Välkommen till ClimbLive";
  }

  handleActivationCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ activationCode: event.currentTarget.value });
  };

  handleActivationCodeKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.keyCode === 13) {
      this.onSubmit();
    }
  };

  inputOk(): boolean {
    return (
      this.state.activationCode !== undefined &&
      this.state.activationCode.length >= 8
    );
  }

  onSubmit = () => {
    if (this.inputOk()) {
      this.setState({ redirect: true });
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to={"/" + this.state.activationCode} />;
    }
    let buttonClass = this.inputOk() ? "large " : "large disabled";

    return (
      <div className="maxWidth">
        <div className="startView view">
          <img
            alt=""
            style={{
              width: 120,
              position: "absolute",
              top: 110,
              right: 0,
              marginRight: "auto",
              left: 0,
              marginLeft: "auto",
              borderRadius: 5,
            }}
            src="logo-square.png"
          />
          <div className="activationWrapper">
            <div className="message" style={{ marginBottom: 10 }}>
              Ange din aktiveringskod
            </div>
            <input
              autoFocus
              style={{ textTransform: "uppercase" }}
              value={this.state.activationCode}
              onChange={this.handleActivationCodeChange}
              onKeyUp={this.handleActivationCodeKeyUp}
            />
            <button className={buttonClass} onClick={this.onSubmit}>
              Fortsätt
            </button>
          </div>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              textAlign: "center",
              padding: 10,
              color: "white",
              borderRadius: 7,
              marginTop: "auto",
              marginBottom: 20,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <div>Vill du använda ClimbLive till din egna bouldertävling?</div>
            <div style={{ marginTop: 10 }}>
              <a href={"https://admin." + Environment.siteDomain}>Klicka här</a>{" "}
              eller <a href="mailto:info@climblive.com">maila oss</a>!
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StartView;
