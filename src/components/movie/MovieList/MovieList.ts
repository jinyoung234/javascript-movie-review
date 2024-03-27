import Image from '../../common/Image/Image';
import Component from '../../common/Component/Component';
import MovieListCard from '../MovieListCard/MovieListCard';

import type { MovieInterface } from '../../../domain/Movie/Movie.type';

import { createElement } from '../../../utils/dom/createElement/createElement';
import { querySelector } from '../../../utils/dom/selector';

import { ELEMENT_SELECTOR } from '../../../constants/selector';

import { NoResultImage } from '../../../assets';

import './MovieList.css';

interface MovieListProps {
  movieItemDetails: MovieInterface[];
  observer: IntersectionObserver;
}

class MovieList extends Component<MovieListProps> {
  protected render() {
    if (!this.props?.movieItemDetails) return;

    if (this.props?.movieItemDetails.length === 0) {
      new Image(this.$element, {
        image: NoResultImage,
        class: 'no-result-image',
        alt: '검색 결과 없음 이미지',
      });

      return;
    }

    if (this.props?.movieItemDetails.length === 20) {
      const observerTarget = querySelector(ELEMENT_SELECTOR.observerTarget);

      this.props?.observer.observe(observerTarget);
    }

    this.$element.append(this.createComponent());
  }

  protected createComponent() {
    const $movieItemList = createElement({ tagName: 'ul', attributeOptions: { class: 'item-list' } });

    this.props?.movieItemDetails.forEach((movieItemDetail) => {
      const $li = createElement({ tagName: 'li' });

      new MovieListCard($li, movieItemDetail);

      $movieItemList.appendChild($li);
    });

    return $movieItemList;
  }
}

export default MovieList;
