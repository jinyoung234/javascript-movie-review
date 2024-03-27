import Component from '../../common/Component/Component';

import Modal from '../../common/Modal/Modal';

import { on } from '../../../utils/dom/eventListener/eventListener';
import { querySelector } from '../../../utils/dom/selector';

import { ELEMENT_SELECTOR } from '../../../constants/selector';

import { WarningImage } from '../../../assets';

import './ErrorFallbackModal.css';

class ErrorFallbackModal extends Component {
  protected render(): void {
    new Modal(this.$element, {
      id: 'error-fallback-modal',
      class: 'error-fallback-modal',
      children: this.createComponent(),
    });
  }

  protected createComponent() {
    return /* html */ `
      <img id="warning-image" class="warning-image" src="${WarningImage}" alt="경고 이미지" />
      <div>시스템 오류가 발생했습니다. 다시 시작해 주세요.</div>
      <button type="button" id="reload-button" class="btn primary">다시 시도하기</button>
    `;
  }

  protected setEvent(): void {
    const button = querySelector<HTMLButtonElement>(ELEMENT_SELECTOR.reloadButton, this.$element);
    on({ target: button, eventName: 'click', eventHandler: this.handleClickReloadButton });
  }

  private handleClickReloadButton() {
    window.location.reload();
  }
}

export default ErrorFallbackModal;
