export const easing = {
  easeOutExpo: (x: number) => {
    const t = x;
    const b = 0;
    const c = 1;
    const d = 1;
    return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
  },
};
