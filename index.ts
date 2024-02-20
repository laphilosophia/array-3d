export class Array3D<T> {
  private values: Array<T>
  private constraint: number
  private keepUnsatisfiedRemains: boolean
  private highlight: { row: T | null; column: T | null }
  private rowIndex: number
  private columnIndex: number
  public result: Array<Array<T>>
  public remains: Array<Array<T>>

  constructor({
    values,
    constraint,
    keepUnsatisfiedRemains,
  }: {
    values: Array<T>
    constraint: number
    keepUnsatisfiedRemains?: boolean
  }) {
    if (values.length <= constraint) {
      throw new Error('Array length cannot be less than constraint.')
    }

    this.values = values
    this.constraint = constraint
    this.keepUnsatisfiedRemains = keepUnsatisfiedRemains || false
    this.result = []
    this.remains = []
    this.rowIndex = 0
    this.columnIndex = 0
    this.highlight = { row: null, column: null }

    this.size = this.size.bind(this)
    this.generate = this.generate.bind(this)
    this.isolate = this.isolate.bind(this)
    this.traverse = this.traverse.bind(this)
    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)
    this.has = this.has.bind(this)
  }

  private equal(arrays: Array<Array<T>>): boolean {
    let result = []

    for (let i = 0; i < arrays.length; i++) {
      result.push(arrays[i].length === this.constraint)
    }

    return result.every((i) => !!i)
  }

  private typeOf(obj: any) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
  }

  public size(param?: { includeRemains?: boolean; onlyNumber?: boolean }): string | number {
    let size: number = 0

    const encoder = new TextEncoder()
    const array = param?.includeRemains ? [...this.result, ...this.remains] : this.result

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        const item = String(array[i][j]).toString()
        size += encoder.encode(item).length
      }
    }

    return param?.onlyNumber ? size : `${size} Bytes`
  }

  public generate(): void {
    let chunk: any[] = []

    for (let i = 0; i < this.values.length; i += this.constraint) {
      chunk.push(this.values.slice(i, i + this.constraint))
    }

    this.result = [...chunk]

    if (!this.equal(this.result)) {
      if (this.keepUnsatisfiedRemains) {
        const remains = this.result.slice(this.result.length - 1)
        this.remains.push(remains[0])
      }

      this.result.pop()
    }
  }

  public isolate({ x, y }: { x: number; y: number }): T | undefined {
    if (typeof this.result[x] !== 'undefined' || typeof this.result[x][y] !== 'undefined') {
      return this.result[x][y]
    } else {
      throw new Error('x / y value exceeds the constraint limit')
    }
  }

  public traverse(
    callback: (row: Array<T> | T) => void,
    { depth, includeRemains }: { depth?: boolean; includeRemains?: boolean }
  ): (void | void[])[] {
    const data = includeRemains ? [...this.result, ...this.remains] : this.result
    return data.map((row) => {
      if (depth) {
        return row.map((column) => callback(column))
      } else {
        return callback(row)
      }
    })
  }

  public prev(param?: { depth?: boolean; includeRemains?: boolean }) {
    const array = param?.includeRemains ? [...this.result, ...this.remains] : this.result

    if (param?.depth) {
      this.columnIndex--

      if (this.columnIndex < 0) {
        this.columnIndex = 0
        this.rowIndex--
      }

      if (this.columnIndex === this.constraint) {
        this.rowIndex--
        this.columnIndex = 0
      }

      if (this.rowIndex === array?.length) {
        this.rowIndex = 0
        this.columnIndex = 0
      }

      Object.assign(this.highlight, {
        row: array[this.rowIndex] || array[0],
        column: array[this.rowIndex][this.columnIndex] || array[0][0],
      })

      return this.highlight
    } else {
      this.rowIndex <= 1 ? (this.rowIndex = 1) : this.rowIndex
      this.rowIndex--

      if (this.rowIndex === array?.length) {
        this.rowIndex = 0
      }

      Object.assign(this.highlight, {
        row: array[this.rowIndex] || array[0],
      })

      return this.highlight
    }
  }

  public next(param?: { depth?: boolean; includeRemains?: boolean }) {
    const array = param?.includeRemains ? [...this.result, ...this.remains] : this.result

    if (param?.depth) {
      this.columnIndex++

      if (this.columnIndex === this.constraint) {
        this.rowIndex++
        this.columnIndex = 0
      }

      if (this.rowIndex === array?.length) {
        this.rowIndex = 0
        this.columnIndex = 0
      }

      Object.assign(this.highlight, {
        row: array[this.rowIndex] || array[0],
        column: array[this.rowIndex][this.columnIndex] || array[0][0],
      })

      return this.highlight
    } else {
      this.rowIndex > array?.length ? (this.rowIndex = array?.length as number) : this.rowIndex
      this.rowIndex++

      if (this.rowIndex === array?.length) {
        this.rowIndex = 0
      }

      Object.assign(this.highlight, {
        row: array[this.rowIndex] || array[0],
      })

      return this.highlight
    }
  }

  public has(key: any, includeRemains?: boolean) {
    let check: boolean = false
    const array = includeRemains ? [...this.result, ...this.remains] : this.result

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        switch (this.typeOf(array[i][j])) {
          case 'string':
          case 'number':
          case 'boolean':
          case 'date':
            if (array[i][j] === key) check = true
            break
          case 'array':
            for (let l = 0; l < (array[i][j] as Array<T>).length; l++) {
              const el = (array[i][j] as Array<T>)[l]
              if (el === key) check = true
            }
            break
          case 'object':
            const hasOwn = Object.prototype.hasOwnProperty
            for (const k in array[i][j]) {
              if (hasOwn.call(array[i][j], k) && array[i][j][k] === key) check = true
            }
            break
          case 'regexp':
            const x = (array[i][j] as RegExp).source
            const y = (key as RegExp).source
            const e = (array[i][j] as RegExp).flags.split('').sort().join('')
            const t = (key as RegExp).flags.split('').sort().join('')

            if (x === y && e === t) check = true
            break
          case 'null':
          case 'undefined':
          case 'function':
            check = false
            throw new Error('Unsupported type')

          default:
            check = false
            break
        }
      }
    }

    return check
  }
}

export function createArray3D<T>({
  values,
  constraint,
  keepUnsatisfiedRemains,
}: {
  values: Array<T>
  constraint: number
  keepUnsatisfiedRemains?: boolean
}) {
  const instance = new Array3D({ values, constraint, keepUnsatisfiedRemains })

  return () => {
    if (instance instanceof Array3D) {
      instance.generate()

      return instance
    }
    const init = new Array3D({ values, constraint, keepUnsatisfiedRemains })
    init.generate()

    return init
  }
}
