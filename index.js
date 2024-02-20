"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var array3d_exports = {};
__export(array3d_exports, {
  Array3D: () => Array3D,
  createArray3D: () => createArray3D
});
module.exports = __toCommonJS(array3d_exports);
var Array3D = class {
  values;
  constraint;
  keepUnsatisfiedRemains;
  highlight;
  rowIndex;
  columnIndex;
  result;
  remains;
  constructor({
    values,
    constraint,
    keepUnsatisfiedRemains
  }) {
    if (values.length <= constraint) {
      throw new Error("Array length cannot be less than constraint.");
    }
    this.values = values;
    this.constraint = constraint;
    this.keepUnsatisfiedRemains = keepUnsatisfiedRemains || false;
    this.result = [];
    this.remains = [];
    this.rowIndex = 0;
    this.columnIndex = 0;
    this.highlight = { row: null, column: null };
    this.size = this.size.bind(this);
    this.generate = this.generate.bind(this);
    this.isolate = this.isolate.bind(this);
    this.traverse = this.traverse.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.has = this.has.bind(this);
  }
  equal(arrays) {
    let result = [];
    for (let i = 0; i < arrays.length; i++) {
      result.push(arrays[i].length === this.constraint);
    }
    return result.every((i) => !!i);
  }
  typeOf(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  }
  size(param) {
    let size = 0;
    const encoder = new TextEncoder();
    const array = param?.includeRemains ? [...this.result, ...this.remains] : this.result;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        const item = String(array[i][j]).toString();
        size += encoder.encode(item).length;
      }
    }
    return param?.onlyNumber ? size : `${size} Bytes`;
  }
  generate() {
    let chunk = [];
    for (let i = 0; i < this.values.length; i += this.constraint) {
      chunk.push(this.values.slice(i, i + this.constraint));
    }
    this.result = [...chunk];
    if (!this.equal(this.result)) {
      if (this.keepUnsatisfiedRemains) {
        const remains = this.result.slice(this.result.length - 1);
        this.remains.push(remains[0]);
      }
      this.result.pop();
    }
  }
  isolate({ x, y }) {
    if (typeof this.result[x] !== "undefined" || typeof this.result[x][y] !== "undefined") {
      return this.result[x][y];
    } else {
      throw new Error("x / y value exceeds the constraint limit");
    }
  }
  traverse(callback, { depth, includeRemains }) {
    const data = includeRemains ? [...this.result, ...this.remains] : this.result;
    return data.map((row) => {
      if (depth) {
        return row.map((column) => callback(column));
      } else {
        return callback(row);
      }
    });
  }
  prev(param) {
    const array = param?.includeRemains ? [...this.result, ...this.remains] : this.result;
    if (param?.depth) {
      this.columnIndex--;
      if (this.columnIndex < 0) {
        this.columnIndex = 0;
        this.rowIndex--;
      }
      if (this.columnIndex === this.constraint) {
        this.rowIndex--;
        this.columnIndex = 0;
      }
      if (this.rowIndex === array?.length) {
        this.rowIndex = 0;
        this.columnIndex = 0;
      }
      Object.assign(this.highlight, {
        row: array[this.rowIndex] || array[0],
        column: array[this.rowIndex][this.columnIndex] || array[0][0]
      });
      return this.highlight;
    } else {
      this.rowIndex <= 1 ? this.rowIndex = 1 : this.rowIndex;
      this.rowIndex--;
      if (this.rowIndex === array?.length) {
        this.rowIndex = 0;
      }
      Object.assign(this.highlight, {
        row: array[this.rowIndex] || array[0]
      });
      return this.highlight;
    }
  }
  next(param) {
    const array = param?.includeRemains ? [...this.result, ...this.remains] : this.result;
    if (param?.depth) {
      this.columnIndex++;
      if (this.columnIndex === this.constraint) {
        this.rowIndex++;
        this.columnIndex = 0;
      }
      if (this.rowIndex === array?.length) {
        this.rowIndex = 0;
        this.columnIndex = 0;
      }
      Object.assign(this.highlight, {
        row: array[this.rowIndex] || array[0],
        column: array[this.rowIndex][this.columnIndex] || array[0][0]
      });
      return this.highlight;
    } else {
      this.rowIndex > array?.length ? this.rowIndex = array?.length : this.rowIndex;
      this.rowIndex++;
      if (this.rowIndex === array?.length) {
        this.rowIndex = 0;
      }
      Object.assign(this.highlight, {
        row: array[this.rowIndex] || array[0]
      });
      return this.highlight;
    }
  }
  has(key, includeRemains) {
    let check = false;
    const array = includeRemains ? [...this.result, ...this.remains] : this.result;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        switch (this.typeOf(array[i][j])) {
          case "string":
          case "number":
          case "boolean":
          case "date":
            if (array[i][j] === key)
              check = true;
            break;
          case "array":
            for (let l = 0; l < array[i][j].length; l++) {
              const el = array[i][j][l];
              if (el === key)
                check = true;
            }
            break;
          case "object":
            const hasOwn = Object.prototype.hasOwnProperty;
            for (const k in array[i][j]) {
              if (hasOwn.call(array[i][j], k) && array[i][j][k] === key)
                check = true;
            }
            break;
          case "regexp":
            const x = array[i][j].source;
            const y = key.source;
            const e = array[i][j].flags.split("").sort().join("");
            const t = key.flags.split("").sort().join("");
            if (x === y && e === t)
              check = true;
            break;
          case "null":
          case "undefined":
          case "function":
            check = false;
            throw new Error("Unsupported type");
          default:
            check = false;
            break;
        }
      }
    }
    return check;
  }
};
function createArray3D({
  values,
  constraint,
  keepUnsatisfiedRemains
}) {
  const instance = new Array3D({ values, constraint, keepUnsatisfiedRemains });
  return () => {
    if (instance instanceof Array3D) {
      instance.generate();
      return instance;
    }
    const init = new Array3D({ values, constraint, keepUnsatisfiedRemains });
    init.generate();
    return init;
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Array3D,
  createArray3D
});
