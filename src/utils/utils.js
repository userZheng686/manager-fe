/**
 * 工具函数封装
 */
export default {
  formatDate(date, rule) {
    let fmt = rule || "yyyy-MM-dd hh:mm:ss";
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, date.getFullYear());
    }
    const o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const val = o[k] + "";
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? val : ("00" + val).substr(val.length)
        );
      }
    }
    return fmt;
  },
  // 动态生成路由，判断路由有没有权限,异步加载路由
  generateRoute(menuList) {
    let routes = [];
    const deepList = (list) => {
      while (list.length) {
        let item = list.pop();
        // 有action就可以取到路由
        if (item.action) {
          routes.push({
            name: item.component,
            path: item.path,
            meta: {
              title: item.menuName,
            },
            component: item.component,
          });
        }
        // 有二级children但是没有action，递归遍历children
        if (item.children && !item.action) {
          deepList(item.children);
        }
      }
    };
    deepList(menuList);
    return routes;
  },
};
