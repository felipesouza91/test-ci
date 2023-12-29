export type Either<L extends Error, A> = Left<L, A> | Right<L, A>

class Left<L, A> {
  readonly value: L

  constructor (value: L) {
    this.value = value
  }

  isLeft (): this is Left<L, A> {
    return true
  }

  isRight (): this is Right<L, A> {
    return false
  }
}

class Right<L, A> {
  readonly value: A

  constructor (value: A) {
    this.value = value
  }

  isLeft (): this is Left<L, A> {
    return false
  }

  isRight (): this is Right<L, A> {
    return true
  }
}

export const left = <L extends Error, A>(l: L): Either<L, A> => {
  return new Left<L, A>(l)
}

export const right = <L extends Error, A>(a: A): Either<L, A> => {
  return new Right<L, A>(a)
}