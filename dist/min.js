var sinuousContext=function(n,t){"use strict";const r=(n,t)=>(...r)=>t(...n(...r));t.api.insert=r(o,t.api.insert),t.api.property=r(o,t.api.property);let u={};function o(n,t,...r){if("function"!=typeof t)return[n,t,...r];function o(...n){const r=u;u=o.t;const c=t(...n);return u=r,c}return o.t={...u},[n,o,...r]}function c(n,...t){function r(){const n=u.u;u.u={...n,...r.u};const o=function n(t){return t.flatMap(t=>{for(;"function"==typeof t;)t=t();return t instanceof DocumentFragment?n(Array.from(t.children)):Array.isArray(t)?n(t):t})}(t);return u.u=n,o}return r.u=n,r}return n.Context=c,n.context=c,n.getContext=function(n){return 0===arguments.length?u&&u.u:u&&u.u&&u.u[n]},n}({},S);