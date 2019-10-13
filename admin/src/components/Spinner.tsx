import * as React from "react";
import "./Spinner.css"

export interface SpinnerProps {
   color:string
}

class Spinner extends React.Component<SpinnerProps> {

   constructor(props: SpinnerProps) {
      super(props);
   }

   render() {
      let bars = [];
      const props = this.props;

      for (let i = 0; i < 12; i++) {
         let barStyle:any = {};
         barStyle.WebkitAnimationDelay = barStyle.animationDelay =
            (i - 12) / 10 + 's';

         barStyle.WebkitTransform = barStyle.transform =
            'rotate(' + (i * 30) + 'deg) translate(146%)';

         barStyle.backgroundColor = this.props.color;

         bars.push(
            <div style={barStyle} className="react-spinner_bar" key={i} />
         );
      }

      return (
         <div {...props} className={'react-spinner'}>
            {bars}
         </div>
      );
   }
};

export default Spinner;