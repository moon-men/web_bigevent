$(function () {
  let layer = layui.layer;

  // 渲染用户信息
  renderUserInfo();

  // 添加退出监听事件
  $("#quitBtn").on("click", function () {
    // 提示用户确定退出
    layer.confirm(
      "确定是否退出?",
      { icon: 3, title: "提示" },
      function (index) {
        // 清除localStorage存储的token值
        localStorage.removeItem("bigevent_token");
        // 跳转到登陆页面
        location.href = "/login.html";
        // 关闭confirm询问框
        layer.close(index);
      }
    );
  });
});

/**
 * 渲染首页用户信息（头像、用户名）
 */
function renderUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    success: function (res) {
      if (res.status === 0) {
        $(".layui-side .username").text(res.data.nickname || res.data.username);
        if (!res.data.user_pic) {
          $(".text-avatar").text(res.data.username.charAt(0).toUpperCase());
        } else {
          $(".text-avatar").css({
            "background-color": 'rgba(0,0,0,0)',
            "background-image": `url(${res.data.user_pic})`,
            "background-repeat": "no-repeat",
            "background-position": "center center",
            "background-size": "30px 30px",
          });
        }
      }
    },
  });
}
