$(function() {
    /**
     * G_data
     */
    let loginUrl = 'https://dev.qualink.com/cheng/scbp/index.html', // 登录链接地址（即后台管理平台登录）
        indexUrl = 'https://dev.qualink.com/cheng/scbp/index.html#/index', // 星火链网业务管理平台首页
        orderUrl = 'https://dev.qualink.com/bcop-web/#/ordermanage';
        
    /**
     * 获取登录信息
     */
    let token = sessionStorage.getItem("token");
    let loginPlatform = $("#login-platform");
    if (token) { 
        // 已登录：显示控制台，跳转到后台管理首页
        loginPlatform.html(`
            <div class="wdf-flex tr">
                <a class="portal-kzt" href="${indexUrl}" target="_self">
                    <img src="static/kzt.png" class="logor kzt" />
                </a>
            </div>
        `)
    } else { 
        // 未登录：显示登录按钮，跳转到后台管理登录页
        loginPlatform.html(`
            <div class="wdf-flex tr">
                <a href="${loginUrl}" class="header-right">
                    <img src="static/xhlw-sy/denglu.png" class="kzt" width="14" />
                    <span style="margin-left:8px; font-size:15px;">登录</span>
                </a>
            </div>
        `)
    }


    /**
     * jump-config-page
     */
    $(document).on("click", ".jump-config-page", function() {
        let _this = $(this),
            _href = _this.attr("data-href");

        if (struId && token) {
            // 已登录
            window.location.href = _href;
        } else {
            // 未登录
            window.location.href = loginUrl;
        }
    }).on("click", ".so-success-jump", function() {
        window.location.href = orderUrl;
    })
})