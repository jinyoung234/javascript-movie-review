import Component from '../../common/Component/Component';
import MovieList from '../MovieList/MovieList';
import MovieTitle from '../MovieTitle/MovieTitle';
import { renderSkeletonList } from '../MovieListCardSkeleton/MovieListCardSkeleton.util';

import Movie from '../../../domain/Movie/Movie';

import { createElement } from '../../../utils/dom/createElement/createElement';
import { querySelector, querySelectorAll } from '../../../utils/dom/selector';
import { bindObserver } from '../../../utils/bindObserver';

import { ELEMENT_SELECTOR } from '../../../constants/selector';

import './MovieReviewBody.css';

interface MovieReviewBodyProps {
  movieType: string;
}

class MovieReviewBody extends Component<MovieReviewBodyProps> {
  private movie: Movie | undefined;
  private observer: IntersectionObserver | undefined;

  static rerender = (movieName: string) => {
    const $section = querySelector<HTMLElement>(ELEMENT_SELECTOR.movieReviewSection);
    $section.remove();

    const $main = querySelector<HTMLElement>(ELEMENT_SELECTOR.main);
    new MovieReviewBody($main, { movieType: movieName });
  };

  protected initializeState(): void {
    this.movie = new Movie(1, this.props?.movieType ?? '');

    this.observer = bindObserver(this.generateInfiniteScroll.bind(this));
  }

  private generateInfiniteScroll() {
    const skeletonList = querySelectorAll(ELEMENT_SELECTOR.skeletonItemCard, this.$element);

    if (skeletonList.length > 0) return;

    const $movieListContainer = querySelector<HTMLDivElement>(ELEMENT_SELECTOR.movieListContainer);

    this.updateMovieList($movieListContainer);
  }

  protected render() {
    this.$element.append(this.createComponent());
    this.$element.append(
      createElement({ tagName: 'div', attributeOptions: { id: 'observer-target', class: 'observer-target' } }),
    );
  }

  protected createComponent() {
    const $section = createElement({
      tagName: 'section',
      attributeOptions: { id: 'movie-review-section', class: 'item-view' },
    });

    const $div = createElement({ tagName: 'div', attributeOptions: { class: 'movie-review-title-container' } });

    new MovieTitle($div, { movieType: this.props?.movieType ?? '' });

    $section.appendChild($div);

    $section.appendChild(this.createMovieListContainer());

    return $section;
  }

  private createMovieListContainer() {
    const $movieListContainer = createElement({
      tagName: 'div',
      attributeOptions: { id: 'movie-list-container', class: 'movie-list-container' },
    });

    this.updateMovieList($movieListContainer);

    return $movieListContainer;
  }

  private updateMovieList($movieListContainer: HTMLElement) {
    const $ul = createElement({ tagName: 'ul', attributeOptions: { class: 'item-list' } });

    renderSkeletonList($movieListContainer, $ul, 8);

    this.renderMovieList($movieListContainer, $ul);
  }

  private renderMovieList($movieListContainer: HTMLElement, $ul: HTMLElement) {
    this.movie?.setPage(1);

    this.movie?.fetchMovieDetails({
      onSuccess: (movieItemDetails) => {
        if (!this.observer || !this.movie) return;

        $ul.remove();

        new MovieList($movieListContainer, {
          movieItemDetails,
          observer: this.observer,
          isEmptyMovieListItems: this.movie.isEmptyMovieItems(movieItemDetails),
          isMaxMovieListItems: this.movie.isMaxMovieItems(movieItemDetails),
        });
      },

      onError: (error) => {
        if (error instanceof Error) {
          console.error(error);

          this.openErrorFallbackModal();
        }
      },
    });
  }

  private openErrorFallbackModal() {
    const $modal = querySelector<HTMLDialogElement>(ELEMENT_SELECTOR.errorFallBackModal);

    $modal.showModal();
  }

  removeScroll() {
    this.observer?.disconnect();
  }
}

export default MovieReviewBody;
