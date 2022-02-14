$(function () {
  let form = layui.form;
  let layer = layui.layer;

  $.ajax({
    method: "GET", url: "/my/userinfo", success: function (res) {
      if (res.status === 0) {
        // $(".layui-form [name='id']").val(res.data.id);
        // $(".layui-form [name='username']").val(res.data.username);
        // $(".layui-form [name='nickname']").val(res.data.nickname);
        // $(".layui-form [name='email']").val(res.data.email);
        form.val('userInfoForm', res.data)
      }
    },
  });

  // 重置信息
  $('#resetBtn').on('click', function (e) {
    e.preventDefault();
    $.ajax({
      method: "GET", url: "/my/userinfo", success: function (res) {
        if (res.status === 0) {
          $(".layui-form [name='id']").val(res.data.id);
          $(".layui-form [name='username']").val(res.data.username);
          $(".layui-form [name='nickname']").val(res.data.nickname);
          $(".layui-form [name='email']").val(res.data.email);
        }
      },
    });
  })

  // 验证表单
  form.verify({
    nickname: function (value) {
      if (value.length > 10) {
        return '昵称必须在10个字符以内';
      }
    }
  })

  // 提交修改信息
  $('.layui-card form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: form.val('userInfoForm'),
      success: function (res) {
        if (res.status !== 0){
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        window.parent.renderUserInfo();
      }
    })
  })

});
