const t=(t,n)=>(...r)=>n(...t(...r));let n={};function r(t,r,...c){if("function"!=typeof r)return[t,r,...c];function o(...t){const c=n;n=o._tracking;const e=r(...t);return n=c,e}return o._tracking={...n},[t,o,...c]}function c(t,...r){function c(){const t=n._ctx;n._ctx=c._ctx;const o=function(t){return t.map(t=>{for(;"function"==typeof t;)t=t();return t})}(r);return n._ctx=t,o}return c._ctx=t,c}function o(t){return 0===arguments.length?n&&n._ctx:n&&n._ctx&&n._ctx[t]}function e(n){n.insert=t(r,n.insert),n.property=t(r,n.property)}export{c as Context,c as context,e as enableContext,o as getContext};