$.ajaxPrefilter(function (options) {
  options.url = "http://www.liulongbin.top:3007" + options.url;
  if (options.url.indexOf("/my") != -1) {
    // 访问的有权限的接口,添加请求头
    options.headers = {
      Authorization: localStorage.getItem("bigevent_token") || "",
    };
  }
  // 全局添加complete回调函数
  options.complete = function (res) {
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      location.href = "/login.html";
    }
  };
});
