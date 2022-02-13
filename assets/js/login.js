$(function () {
  let layer = layui.layer;

  // 点击去注册事件
  $("#toRegister").on("click", function () {
    $(".login").css("display", "none");
    $(".register").css("display", "block");
  });

  // 点击去登陆事件
  $("#toLogin").on("click", function () {
    $(".login").css("display", "block");
    $(".register").css("display", "none");
  });

  // 注册账号
  $('.register form').on('submit', function (e) {
    e.preventDefault()
    // 获取用户名、密码
    let username = $('.register [name=username]').val();
    let password = $('.register [name=password]').val();
    // 发起 ajax 请求注册
    $.ajax({
      method: 'POST',
      url: '/api/reguser',
      data: {
        username: username,
        password: password
      },
      success: function (res) {
        layer.msg(res.message);
        if (res.status === 0) {
          $("#toLogin").click();
        }
      }
    })
  })

  // 登录
  $('.login form').on('submit', function (e) {
    e.preventDefault();
    // 获取用户名、密码
    let username = $('.login [name=username]').val();
    let password = $('.login [name=password]').val();
    // 发送请求登录
    $.ajax({
      method: 'POST',
      url: '/api/login',
      data: {
        username: username,
        password: password
      },
      success: function (res) {
        // 登录失败
        if (res.status !== 0) return layer.msg(res.message);
        // 登录成功, 保存token
        localStorage.setItem('bigevent_token', res.token)
        location.href = '/index.html'
      }
    })
  })

  // layui 自定义校验规则
  let form = layui.form;
  form.verify({
    username: function (value, item) {
      //value：表单的值、item：表单的DOM对象
      if (!/^[a-zA-Z][a-zA-z0-9_]{4,7}$/.test(value)) {
        return "用户名长度必须为5-8位(字母开头，允许包含下划线)";
      }
      if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
        return "用户名不能有特殊字符";
      }
      if (/(^\_)|(\__)|(\_+$)/.test(value)) {
        return "用户名首尾不能出现下划线'_'";
      }
      if (/^\d+\d+\d$/.test(value)) {
        return "用户名不能全为数字";
      }
    },
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    confirmPwd: function (value) {
      let pwd = $(".register [name=password]").val();
      if (value !== pwd) {
        return "两次密码不一致";
      }
    },
  });
});
