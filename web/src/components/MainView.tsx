import * as React from "react";
import ReactModal from "react-modal";
import { connect, ConnectedProps } from "react-redux";
import { Redirect, RouteComponentProps, withRouter } from "react-router";
import { clearErrorMessage, sortProblems } from "../actions/actions";
import {
  loadUserData,
  saveUserData,
  setProblemStateAndSave,
} from "../actions/asyncActions";
import { SortBy } from "../constants/constants";
import { StoreState } from "../model/storeState";
import ContenderInfoComp from "./ContenderInfoComp";
import "./MainView.css";
import ProblemList from "./ProblemList";
import Spinner from "./Spinner";

export interface Props {}

type State = {
  userInfoModalIsOpen: boolean;
  rulesModalIsOpen: boolean;
  goBack: boolean;
};

class MainView extends React.Component<
  Props & PropsFromRedux & RouteComponentProps,
  State
> {
  public readonly state: State = {
    userInfoModalIsOpen: false,
    rulesModalIsOpen: false,
    goBack: false,
  };

  componentDidMount() {
    ReactModal.setAppElement("body");

    let code: string = this.props.match.params["code"];
    this.props.loadUserData!(code);
  }

  render() {
    const code = this.props.match.params["code"];
    if (this.state.goBack) {
      return <Redirect to="/" />;
    } else if (this.props.contenderNotFound) {
      let goBack = () => {
        this.setState({ goBack: true });
      };

      return (
        <div className="maxWidth">
          <div className="startView view">
            <div className="activationWrapper">
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
              <div style={{ marginTop: 50, textAlign: "center" }}>
                <div style={{ marginBottom: 10 }}>
                  Registreringskoden är inte giltig.
                  <br />
                  Vänligen kontrollera att den är rätt.
                </div>
                <button className="large" onClick={goBack}>
                  Försök igen
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (
      !(
        this.props.contenderData &&
        this.props.problems &&
        this.props.contest &&
        this.props.compClasses &&
        this.props.ticks
      )
    ) {
      return (
        <div className="maxWidth">
          <div className="view mainView">
            <div style={{ marginTop: 50, textAlign: "center" }}>
              <div style={{ marginBottom: 5 }}>Vänta...</div>
              <Spinner color={"#333"} />
            </div>
          </div>
        </div>
      );
    } else if (!this.props.contenderData.name) {
      let openRulesModal = () => {};
      return (
        <div className="maxWidth">
          <div className="view mainView">
            <ContenderInfoComp
              existingUserData={this.props.contenderData}
              activationCode={code}
              contest={this.props.contest}
              compClasses={this.props.compClasses}
              saveUserData={this.props.saveUserData}
              onFinished={openRulesModal}
            ></ContenderInfoComp>
          </div>
        </div>
      );
    } else if (this.state.userInfoModalIsOpen) {
      let closeUserInfoModal = () => {
        this.setState({ userInfoModalIsOpen: false });
      };

      return (
        <div className="maxWidth">
          <div className="view mainView">
            <ContenderInfoComp
              existingUserData={this.props.contenderData}
              activationCode={code}
              contest={this.props.contest}
              compClasses={this.props.compClasses}
              saveUserData={this.props.saveUserData}
              isProfile={true}
              onFinished={closeUserInfoModal}
            ></ContenderInfoComp>
          </div>
        </div>
      );
    } else {
      document.title = this.props.contenderData.name;
      const points = this.props.ticks
        .map((tick) => {
          const problem = this.props.problems.find(
            (problem) => problem.id === tick.problemId
          );

          if (problem === undefined) {
            return 0;
          }

          return tick.flash
            ? problem.points + (problem.flashBonus ?? 0)
            : problem.points;
        })
        .sort((a, b) => b - a);
      const totalPoints = points.reduce((s, p) => s + p, 0);
      let qualifyingProblems = this.props.contest.qualifyingProblems;
      let qualifyingScore = points
        .slice(0, qualifyingProblems)
        .reduce((s, p) => s + p, 0);

      let openUserInfoModal = () => {
        this.setState({ userInfoModalIsOpen: true });
      };

      let closeRulesModal = () => {
        this.setState({ rulesModalIsOpen: false });
      };

      let rules = this.props.contest ? this.props.contest.rules : "";
      const compClass = this.props.compClasses.find(
        (compClass) => compClass.id === this.props.contenderData?.compClassId
      );

      return (
        <div className="maxWidth">
          <div className="view mainView">
            <div className="titleRow">
              <div className="name">{this.props.contenderData.name}</div>
              <div>{compClass?.name}</div>
              <button onClick={openUserInfoModal}>Ändra</button>
            </div>
            <div className="pointsRow">
              <div className="points">{totalPoints}</div>
              <div className="pointsDesc total">Totalpoäng</div>

              {this.props.contest.finalEnabled && (
                <>
                  <div className="pointsDesc">{qualifyingProblems} bästa</div>
                  <div className="points">{qualifyingScore}</div>
                </>
              )}
            </div>
            <div className="headerRow">
              <div
                className={
                  this.props.problemsSortedBy === SortBy.BY_NUMBER
                    ? "selector selected"
                    : "selector"
                }
                onClick={() => this.props.sortProblems!(SortBy.BY_NUMBER)}
              >
                Sortera efter nummer
              </div>
              <div
                className={
                  this.props.problemsSortedBy === SortBy.BY_POINTS
                    ? "selector selected"
                    : "selector"
                }
                onClick={() => this.props.sortProblems!(SortBy.BY_POINTS)}
              >
                Sortera efter poäng
              </div>
            </div>
            <ProblemList
              problems={this.props.problems}
              ticks={this.props.ticks}
              problemIdBeingUpdated={this.props.problemIdBeingUpdated}
              setProblemStateAndSave={this.props.setProblemStateAndSave}
            />
            <ReactModal
              isOpen={this.state.rulesModalIsOpen}
              contentLabel="Example Modal"
              className="modal"
            >
              <div dangerouslySetInnerHTML={{ __html: rules }}></div>
              <div className="buttonRow">
                <button onClick={closeRulesModal}>Fortsätt</button>
              </div>
            </ReactModal>

            <ReactModal
              isOpen={this.props.errorMessage !== undefined}
              contentLabel="Example Modal"
              className="modal"
            >
              <div>{this.props.errorMessage}</div>
              <div className="buttonRow">
                <button onClick={this.props.clearErrorMessage!}>Ok</button>
              </div>
            </ReactModal>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state: StoreState) => ({
  contenderData: state.contenderData,
  contenderNotFound: state.contenderNotFound,
  contest: state.contest,
  problems: state.problems,
  compClasses: state.compClasses,
  ticks: state.ticks,
  problemsSortedBy: state.problemsSortedBy,
  problemIdBeingUpdated: state.problemIdBeingUpdated,
  errorMessage: state.errorMessage,
});

const mapDispatchToProps = {
  setProblemStateAndSave,
  loadUserData,
  saveUserData,
  sortProblems,
  clearErrorMessage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(MainView));
