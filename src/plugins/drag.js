// 这个助手方法下面会用到，用来获取 css 相关属性值
const getAttr = (obj, key) => (
    obj.currentStyle
    ? obj.currentStyle[key]
    : window.getComputedStyle(obj, false)[key]
);

const drag = {
  created(el) {
    const target = el.children[0].children[0]
    const header = target.children[0]
    // 鼠标手型
    header.style.cursor = 'move';
    el.onmousedown = (e) => {
        // 记录按下时鼠标的坐标和目标元素的 left、top 值
        const currentX = e.clientX;
        const currentY = e.clientY
        const left = parseInt(getAttr(target, 'left'));
        const top = parseInt(getAttr(target, 'top'));
        
        // 分别计算四个方向的边界值
        const minLeft = target.offsetLeft + parseInt(getAttr(target, 'width')) - 50;
        const maxLeft = parseInt(getAttr(document.body, 'width')) - target.offsetLeft - 50;
        const minTop = target.offsetTop;
        const maxTop = parseInt(getAttr(document.body, 'height'))
        - target.offsetTop - parseInt(getAttr(header, 'height'));

        document.onmousemove = (event) => {
            // 鼠标移动时计算每次移动的距离，并改变拖拽元素的定位
            const disX = event.clientX - currentX;
            const disY = event.clientY - currentY;
            // 判断左、右边界
            if (disX < 0 && disX <= -minLeft) {
                target.style.left = `${minLeft - left}px`;
            } else if (disX > 0 && disX >= maxLeft) {
                target.style.left = `${left + maxLeft}px`;
            } else {
                target.style.left = `${left + disX}px`;
            }
            
            // 判断上、下边界
            if (disY < 0 && disY <= -minTop) {
                target.style.top = `${top - minTop}px`;
            } else if (disY > 0 && disY >= maxTop) {
                target.style.top = `${top + maxTop}px`;
            } else {
                target.style.top = `${top + disY}px`;
            }
            
            // 阻止事件的默认行为，可以解决选中文本的时候拖不动
            return false
        }
        
        // 鼠标松开时，拖拽结束
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    }
  },
  // 在绑定元素的父组件挂载之前调用
  beforeMount() {},
  // 绑定元素的父组件被挂载时调用
  mounted() {
    // console.log('我被绑定了')
  },
  // 在包含组件的 VNode 更新之前调用
  beforeUpdate(el) {
    
  },
  // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
  updated(el) {
    
  },
  // 在绑定元素的父组件卸载之前调用
  beforeUnmount() {
  },
  // 卸载绑定元素的父组件时调用
  unmounted(el) {
    const target = el.children[0].children[0]
    target.onmousedown = null;
  },
};

const directives = {
  drag,
};

export default {
  install(Vue) { 
    Object.keys(directives).forEach((key) => {    
      Vue.directive(key, directives[key]);
    });
  },
};
