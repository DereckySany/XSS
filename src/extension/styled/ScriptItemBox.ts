import styled from 'styled-components';
import { rgba } from 'polished';

const ScriptItemBox = styled.div`
  width: calc(100% - 60px);
  height: 40px;
  margin: 4px 10px 4px 50px;
  position: relative;
  display: inline-block;
  border: 1px dashed ${props => props.theme.color.yallow};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.color.scriptItemBoxBg};
  box-sizing: border-box;
  transition: ${props => props.theme.transitionTime};
  overflow: hidden;

  .mask {
    width: 100%;
    height: 100%;
    background: ${props => props.theme.color.maskBg};
    opacity: 0;
    position: absolute;
    transition: ${props => props.theme.transitionTime};
  }

  &:hover {
    border: 1px solid ${props => props.theme.color.hoverLine};
    box-shadow: 0 0 5px 0 ${props => rgba(props.theme.color.hoverLine, 0.35)};

    .mask {
      opacity: 1;
    }
  }
`;

export const AddScriptItemBox = styled(ScriptItemBox)`
  width: calc(100% - 20px);
  margin: 4px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-color: ${props => rgba(props.theme.color.yallow, 0.5)};
  margin-bottom: 10px;

  img {
    opacity: 0.3;
    pointer-events: none;
  }

  &:hover {
    border: 1px solid ${props => rgba(props.theme.color.hoverLine, 0.4)};
    box-shadow: 0 0 5px 0 ${props => rgba(props.theme.color.hoverLine, 0.35)};

    img {
      opacity: 1;
    }
  }
`;

export default ScriptItemBox;
