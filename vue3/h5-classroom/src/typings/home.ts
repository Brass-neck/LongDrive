export enum CATEGORY_TYPES {
  ALL,
  REACT,
  VUE,
  NODE
}

export interface ISlider {
  url: string
}

export interface ILesson {
  title: string
  video: string
  poster: string
  price: number
  category?: string
}

export interface ILessons {
  hasMore: boolean
  loading: boolean
  offset: number
  limit: number
  list: ILesson[]
}

export interface IHomeState {
  currentCategory: CATEGORY_TYPES
  sliders: ISlider[]
  lessons: ILessons
}
