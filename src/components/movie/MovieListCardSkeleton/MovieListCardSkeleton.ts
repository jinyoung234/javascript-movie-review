import Component from '../../common/Component/Component';

import { createElement } from '../../../utils/dom/createElement/createElement';

import './MovieListCardSkeleton.css';

class MovieListCardSkeleton extends Component {
  protected render() {
    this.$element.appendChild(this.createComponent());
  }

  protected createComponent() {
    const li = createElement({ tagName: 'li' });

    li.innerHTML = /* html */ `
      <div id="item-card-skeleton" class="item-card">
        <div class="item-thumbnail skeleton"></div>
        <div class="item-title skeleton"></div>
        <div class="item-score skeleton"></div>
      </div>
    `;

    return li;
  }
}

export default MovieListCardSkeleton;
