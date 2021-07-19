// main header
import terminalBarStyles from './index.module.scss';

function TerminalBar({children}) {
  return (
    <>
      <div className={`${terminalBarStyles.container}`}>
        <div className={terminalBarStyles.empty}></div>
        <div className={`${terminalBarStyles.button} ${terminalBarStyles.button__red}`}></div>
        <div className={`${terminalBarStyles.button} ${terminalBarStyles.button__yellow}`}></div>
        <div className={`${terminalBarStyles.button} ${terminalBarStyles.button__green}`}></div>
        <div className={`${terminalBarStyles.title}`}>
          {children}
        </div>
        <div className={`${terminalBarStyles.text} ${terminalBarStyles.text__right}`}>⌥⌘1</div>
        <div className={terminalBarStyles.empty}></div>
      </div>
    </>
  );
}

export default TerminalBar;