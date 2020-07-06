import * as React from "react";
import "./ContenderInfoComp.css";
import { ContenderData } from "../model/contenderData";
import { Contest } from "../model/contest";
import { CompClass } from "../model/compClass";

export interface Props {
  activationCode: string;
  contest: Contest;
  compClasses: CompClass[];
  existingUserData: ContenderData;
  isProfile?: boolean;
  saveUserData?: (userData: ContenderData) => Promise<ContenderData>;
  onFinished?: () => void;
}

type State = {
  name?: string;
  compClassId?: number;
};

export default class ContenderInfoComp extends React.Component<Props, State> {
  public readonly state: State = {
    name: this.props.existingUserData.name,
    compClassId: this.props.existingUserData.compClassId,
  };

  constructor(props: Props) {
    super(props);
  }

  handleNameCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.state.name = event.currentTarget.value;
    this.setState(this.state);
  };

  setCompClass = (compClassId: number) => {
    this.state.compClassId = compClassId;
    this.setState(this.state);
  };

  onSubmit = () => {
    if (this.inputOk()) {
      let contenderData: ContenderData = {
        ...this.props.existingUserData,
        name: this.state.name!,
        compClassId: this.state.compClassId!,
        contestId: this.props.contest.id,
      };
      this.props.saveUserData!(contenderData).then(this.props.onFinished!);
    }
  };

  inputOk(): boolean {
    console.log("this.state.compClassId", this.state.compClassId);
    return (
      this.state.compClassId !== undefined &&
      this.state.name !== undefined &&
      this.state.name.trim().length > 1
    );
  }

  render() {
    console.log(this.props);
    if (!this.props.contest) {
      return <div>Vänta...</div>;
    }
    let submitButtonClass = this.inputOk() ? "" : "disabled";
    let compClasses = this.props.compClasses.map((compClass) => (
      <div
        key={compClass.name}
        className={
          compClass.id == this.state.compClassId
            ? "selector compClass selected"
            : "selector compClass"
        }
        onClick={() => this.setCompClass(compClass.id)}
      >
        <div>{compClass.name}</div>
        <div className="compClassDescription">{compClass.description}</div>
      </div>
    ));

    let buttons;
    submitButtonClass += " large";
    buttons = (
      <div>
        <button className={submitButtonClass} onClick={this.onSubmit}>
          Fortsätt
        </button>
      </div>
    );

    return (
      <div style={{ paddingTop: 20 }}>
        {!this.props.isProfile && (
          <div style={{ fontSize: 13, color: "#808080", marginBottom: 6 }}>
            Välkommen
          </div>
        )}
        {this.props.isProfile && (
          <div style={{ fontSize: 34, marginBottom: 24, fontWeight: "bold" }}>
            Din profil
          </div>
        )}
        {!this.props.isProfile && (
          <div style={{ fontSize: 34, marginBottom: 24, fontWeight: "bold" }}>
            Registrera dig
          </div>
        )}
        <div
          style={{
            background: "#f3f5f6",
            margin: "0 -10px",
            padding: "10px 15px 45px 10px",
          }}
        >
          <div style={{ color: "#8c8c8c", marginBottom: 17 }}>Välj klass</div>
          <div className="compClassContainer">{compClasses}</div>
        </div>
        <div
          style={{
            marginTop: 25,
            marginBottom: 3,
            fontSize: 12,
            color: "#6c727c",
          }}
        >
          Fullständigt namn:
        </div>
        <input
          autoFocus
          style={{ textAlign: "left" }}
          value={this.state.name}
          onChange={this.handleNameCodeChange}
        />
        {buttons}
        <div style={{ position: "relative", marginTop: 20 }}>
          <img
            style={{
              width: "100%",
              borderRadius: 10,
              boxShadow: "2px 8px 5px #e4e3e3",
            }}
            src="/contest.jpg"
          />
          <div
            style={{ position: "absolute", top: 15, left: 15, color: "white" }}
          >
            {this.props.contest.name}
          </div>
          <img
            style={{ position: "absolute", width: 40, bottom: 15, right: 15 }}
            src="/logos/klatterdomen.jpg"
          />
        </div>
        <div
          style={{ marginTop: 20, marginBottom: 10 }}
          dangerouslySetInnerHTML={{ __html: this.props.contest.rules }}
        ></div>
      </div>
    );
  }
}
