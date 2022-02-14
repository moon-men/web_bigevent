$(function () {
  let form = layui.form;

  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    confirmOldPwd: function (value) {
      let pwd = $(".layui-form [name=oldPwd]").val();
      if (value === pwd) {
        return "输入的新旧密码不能相同";
      }
    },
    confirmNewPwd: function (value) {
      let pwd = $(".layui-form [name=newPwd]").val();
      if (value !== pwd) {
        return "输入的两次密码不一致";
      }
    },
  });

  $(".layui-card form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/updatepwd",
      data: form.val("updatePwdForm"),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        // 重置表单
        $('.layui-form')[0].reset()
      },
    });
  });
});
