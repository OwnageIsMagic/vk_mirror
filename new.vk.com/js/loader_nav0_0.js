var navMap = {
    '<void>': ['al_index.php', ['index.css', 'index.js']],
    '<other>': ['al_profile.php', ['profile.css', 'page.css', 'profile.js', 'page.js']],
    'public\\d+($|/)': ['al_public.php', ['public.css', 'page.css', 'public.js', 'page.js']],
    'event\\d+($|/)': ['al_events.php', ['groups.css', 'page.css', 'groups.js', 'page.js']],
    'club\\d+($|/)': ['al_groups.php', ['groups.css', 'page.css', 'groups.js', 'page.js']],
    'publics\\d+($|/)': ['al_public.php', ['public.css', 'page.css', 'public.js', 'page.js']],
    'groups(\\d+)?$': ['al_groups.php', ['groups.css', 'groups_list.js', 'indexer.js']],
    'events$': ['al_groups.php', ['groups.css', 'page.css', 'groups.js', 'page.js']],
    'changemail$': ['register.php', ['reg.css']],
    'mail($|/)': ['al_mail.php', ['mail.css', 'mail.js']],
    'write[-]?\\d*($|/)': ['al_mail.php', ['mail.css', 'mail.js']],
    'im($|/)': ['al_im.php', ['imn.js', 'im.css', 'emoji.js', 'notifier.css']],
    'gim\\d+($|/)': ['al_im.php', ['imn.js', 'im.css', 'emoji.js', 'notifier.css']],
    'audio-?\\d+_\\d+$': ['al_audio.php', ['audio.css', 'audio.js']],
    'audios(-?\\d+)?$': ['al_audio.php', ['audio.css', 'audio.js']],
    'audio($|/)': ['al_audio.php', ['audio.css', 'audio.js']],
    'apps_check($|/)': ['al_apps_check.php', ['apps.css', 'apps.js']],
    'apps($|/)': ['al_apps.php', ['apps.css', 'apps.js']],
    'editapp($|/)': ['al_apps_edit.php', ['apps.css', 'apps.js']],
    'regstep\\d$': ['register.php', ['reg.js', 'reg.css', 'ui_controls.js', 'ui_controls.css', 'selects.js']],
    'video(-?\\d+_\\d+)?$': ['al_video.php', ['video.js', 'video.css', 'videoview.js', 'videoview.css', 'indexer.js']],
    'videos(-?\\d+)?$': ['al_video.php', ['video.js', 'video.css', 'indexer.js']],
    'feed$': ['al_feed.php', ['page.css', 'page.js', 'feed.css', 'feed.js']],
    'friends$': ['al_friends.php', ['friends.js', 'friends.css', 'privacy.css']],
    'friendsphotos$': ['al_photos.php', ['friendsphotos.js', 'photoview.js', 'friendsphotos.css', 'photoview.css']],
    'wall-?\\d+(_\\d+)?$': ['al_wall.php', ['page.js', 'page.css', 'wall.js', 'wall.css']],
    'tag\\d+$': ['al_photos.php', ['photos.js', 'photoview.js', 'photos.css', 'photoview.css']],
    'albums(-?\\d+)?$': ['al_photos.php', ['photos.js', 'photos.css']],
    'photos(-?\\d+)?$': ['al_photos.php', ['photos.js', 'photos.css']],
    'album-?\\d+_\\d+$': ['al_photos.php', ['photos.js', 'photos.css']],
    'photo-?\\d+_\\d+$': ['al_photos.php', ['photos.js', 'photos.css', 'photoview.js', 'photoview.css']],
    'search$': ['al_search.php', ['search.css', 'search.js']],
    'people($|/)': ['al_search.php', ['search.css', 'search.js']],
    'communities$': ['al_search.php', ['search.css', 'search.js']],
    'brands$': ['al_search.php', ['search.css', 'search.js']],
    'invite$': ['invite.php', ['invite.css', 'invite.js', 'ui_controls.css', 'ui_controls.js']],
    'join$': ['join.php', ['join.css', 'join.js']],
    'settings$': ['al_settings.php', ['settings.js', 'settings.css']],
    'edit$': ['al_profileEdit.php', ['profile_edit.js', 'profile_edit.css']],
    'blog($|/)': ['blog.php', ['blog.css', 'blog.js', 'page.js']],
    'fave$': ['al_fave.php', ['fave.js', 'fave.css', 'page.css', 'wall.css', 'qsorter.js', 'indexer.js']],
    'topic$': ['al_board.php', ['board.css']],
    'board\\d+$': ['al_board.php', ['board.css', 'board.js']],
    'topic-?\\d+_\\d+$': ['al_board.php', ['board.css', 'board.js']],
    'stats($|/)': ['al_stats.php', ['stats.css']],
    'ru/(.*)?$': ['al_pages.php', ['pages.css', 'pages.js', 'wk.css', 'wk.js']],
    'pages($|/)': ['al_pages.php', ['pages.css', 'pages.js', 'wk.css', 'wk.js']],
    'page-?\\d+_\\d+$': ['al_pages.php', ['pages.css', 'pages.js', 'wk.css', 'wk.js']],
    'restore($|/)': ['al_restore.php', ['restore.js', 'restore.css']],
    'recover($|/)': ['recover.php', ['recover.js', 'recover.css']],
    'gifts\\d*$': ['al_gifts.php', ['gifts.js', 'gifts.css']],
    'docs($|/)': ['docs.php', ['docs.css', 'docs.js', 'indexer.js']],
    'doc-?\\d+_\\d+$': ['docs.php', ['docs.css', 'docs.js', 'indexer.js']],
    'docs-?\\d+$': ['docs.php', ['docs.css', 'docs.js', 'indexer.js']],
    'login($|/)': ['al_login.php', ['login.css', 'login.js']],
    'tasks($|/)': ['tasks.php', ['tasks.css', 'tasks.js']],
    'abuse($|/)': ['abuse.php', ['abuse.css', 'abuse.js']],
    'abuse2($|/)': ['abuse2.php', []],
    'restore2($|/)': ['restore2.php', ['dyn-restore2.css', 'dyn-restore2.js', 'dyn-restore2_aa.js', 'sorter.js']],
    'datababes($|/)': ['datababes.php', []],
    'support($|/)': ['al_tickets.php', ['tickets.css', 'tickets.js']],
    'helpdesk($|/)': ['al_helpdesk.php', ['tickets.css', 'tickets.js']],
    'offersdesk($|/)': ['offers.php', ['offers.css', 'offers.js']],
    'payments($|/)': ['al_payments.php', ['payments.css']],
    'faq($|\\d+|/)': ['al_faq.php', ['faq.css', 'faq.js']],
    'tlmd($|\\d+|/)': ['al_talmud.php', ['faq.js', 'faq.css', 'tickets.css', 'tickets.js', 'tags_dd.js', 'tags_dd.css']],
    'sms_office($|/)': ['sms_office.php', ['sms_office.css', 'sms_office.js']],
    'dev($|/)': ['dev.php', ['dev.css', 'dev.js']],
    'developers($|/)': ['al_developers.php', ['developers.css']],
    'help($|/)': ['al_help.php', ['help.css', 'help.js']],
    'claims($|/)': ['al_claims.php', ['claims.css', 'claims.js']],
    'video_embed($|/)': ['al_video_embed.php', ['video_embed.css', 'video_embed.js']],
    'ads$': ['ads.php', ['ads.css', 'ads.js']],
    'adbonus$': ['ads.php', ['ads.css', 'ads.js']],
    'adsbonus$': ['ads.php', ['ads.css', 'ads.js']],
    'adregister$': ['ads.php', ['ads.css', 'ads.js']],
    'adsedit$': ['ads_edit.php', ['ads.css', 'ads.js', 'ads_edit.css', 'ads_edit.js']],
    'adscreate$': ['ads_edit.php', ['ads.css', 'ads.js', 'ads_edit.css', 'ads_edit.js']],
    'adsmoder$': ['ads_moder.php', ['ads.css', 'ads.js', 'ads_moder.css', 'ads_moder.js']],
    'adsweb$': ['ads_web.php', ['ads.css', 'ads.js', 'ads_web.css', 'ads_web.js']],
    'exchange$': ['ads_posts.php', ['ads.css', 'ads.js', 'exchange.css', 'exchange.js']],
    'exchangemoder$': ['ads_posts_moder.php', ['ads.css', 'ads.js', 'exchange_moder.css', 'exchange_moder.js']],
    'offers$': ['ads_offers.php', ['ads.css', 'ads.js', 'ads_offers.css', 'ads_offers.js']],
    'offersmoder$': ['ads_offers_moder.php', ['ads.css', 'ads.js', 'ads_offers_moder.css', 'ads_offers_moder.js']],
    'test$': ['al_help.php', ['help.css', 'help.js']],
    'agenttest$': ['al_help.php', ['help.css', 'help.js']],
    'grouptest$': ['al_help.php', ['help.css', 'help.js']],
    'dmca$': ['al_tickets.php', ['tickets.css', 'tickets.js']],
    'terms$': ['al_help.php', ['help.css', 'help.js']],
    'privacy$': ['al_help.php', ['help.css', 'help.js']],
    'licence$': ['al_help.php', ['help.css', 'help.js']],
    'editdb$': ['editdb.php', ['editdb.css', 'editdb.js']],
    'note\\d+_\\d+$': ['al_wall.php', ['wall.js', 'wall.css', 'wk.js', 'wk.css', 'pagination.js']],
    'notes(\\d+)?$': ['al_wall.php', ['wall.js', 'wall.css', 'wk.js', 'wk.css', 'pagination.js']],
    'bugs($|/)': ['bugs.php', ['bugs.css', 'bugs.js']],
    'wkview.php($)': ['wkview.php', ['wkview.js', 'wkview.css', 'wk.js', 'wk.css']],
    'stickers_office($|/)': ['stickers_office.php', ['stickers_office.css', 'stickers_office.js']],
    'charts($|/)': ['al_audio.php', ['audio.css', 'audio.js']],
    'maps($|/)': ['maps.php', []],
    'jobs$': ['al_jobs.php', ['jobs.css', 'jobs.js', 'blog.css', 'blog.js']],
    'about$': ['blog.php', ['blog.css', 'blog.js']],
    'products$': ['blog.php', ['blog.css', 'blog.js']],
    'ui$': ['ui.php', []],
    'translation$': ['al_translation.php', []],
    'mobile$': ['al_login.php', []],
    'stickers($|/)': ['al_im.php', ['imn.js', 'im.css', 'emoji.js', 'notifier.css']],
    'print$': ['al_print.php', ['print.css', 'print.js']],
    'pattern(\\d+)?$': ['patterns_info.php', ['dyn-patterns_info.css', 'dyn-patterns_info.js', 'page.css']],
    'link(\\d+)?$': ['patterns_info.php', ['dyn-patterns_info.css', 'dyn-patterns_info.js', 'page.css']],
    'autoreg(\\d+)?$': ['patterns_info.php', ['dyn-patterns_info.css', 'dyn-patterns_info.js', 'page.css']],
    'statlogs($|/)': ['statlogs_view.php', ['statlogs.css']],
    'market(-?\\d+)?(_\\d+)?$': ['al_market.php', ['market.css', 'market.js']],
    'landings$': ['landings.php', []],
    'ach($|/)': ['achievements.php', ['achievements.css', 'achievements.js']],
    'memedit($|/)': ['members.php', ['members.css', 'dyn-members.js']],
    'meminfo($|/)': ['member_info.php', ['dyn-meminfo.js', 'meminfo.css']],
    'groupinfo($|/)': ['group_info.php', ['groupinfo.css']]
};
var stVersions = {
    'nav': 0,
    'fonts_cnt.css': 2157913508,
    'common.js': 1134,
    'common.css': 755324602,
    'pads.js': 1601311133,
    'pads.css': 2990519186,
    'retina.css': 1820592869,
    'uncommon.js': 3297864069,
    'uncommon.css': 2716404539,
    'filebutton.css': 2582548248,
    'filebutton.js': 1457823047,
    'lite.js': 2845910091,
    'lite.css': 1751481262,
    'ie6.css': 1054141387,
    'ie7.css': 532233945,
    'rtl.css': 2187845273,
    'pagination.js': 46926455,
    'blog.css': 1729229312,
    'blog.js': 1736752174,
    'html5audio.js': 1230354391,
    'html5video.js': 3599850170,
    'html5video.css': 2888812888,
    'audioplayer.js': 3202217982,
    'audioplayer.css': 616802689,
    'audio_html5.js': 3586987067,
    'audio.js': 3693687809,
    'audio.css': 3109331919,
    'gifts.css': 2651802614,
    'gifts.js': 2778120873,
    'cc.js': 4037201610,
    'indexer.js': 4037127100,
    'graph.js': 3091977822,
    'graph.css': 3239590526,
    'boxes.css': 554992489,
    'box.js': 986491972,
    'rate.css': 768419415,
    'tooltips.js': 3849506067,
    'tooltips.css': 910233641,
    'sorter.js': 2514645581,
    'qsorter.js': 2821441961,
    'usorter.js': 2212338539,
    'phototag.js': 923648927,
    'phototag.css': 4181635447,
    'photoview.js': 2579613503,
    'photoview.css': 1868663365,
    'fullscreen_pv.js': 130423898,
    'fullscreen_pv.css': 4205026425,
    'friendsphotos.js': 3869757571,
    'friendsphotos.css': 3816436303,
    'spe.js': 2980196320,
    'friends.js': 3131909692,
    'friends.css': 1788692183,
    'friends_search.js': 2727513341,
    'friends_search.css': 204916655,
    'board.js': 2032238825,
    'board.css': 3461031163,
    'photos.css': 526462145,
    'photos.js': 1837585371,
    'photos_add.css': 1321562989,
    'photos_add.js': 4132061776,
    'wkpoll.js': 3872977013,
    'wkview.js': 2357067713,
    'wkview.css': 1496830938,
    'single_pv.css': 1756823785,
    'single_pv.js': 2569562240,
    'video.js': 2467881146,
    'video.css': 3949503983,
    'videocat.js': 435413719,
    'videocat.css': 1483166340,
    'videoview.js': 3609993331,
    'videoview.css': 2278253649,
    'video_edit.js': 660308478,
    'video_edit.css': 4110752837,
    'video_upload.js': 2236165204,
    'video_youtube.js': 3123894146,
    'video_youtube.css': 3591312868,
    'videoplayer.js': 2454972514,
    'videoplayer.css': 2419084687,
    'translation.js': 3444393106,
    'translation.css': 4017022451,
    'reg.css': 1314058211,
    'reg.js': 675443900,
    'invite.css': 3974261453,
    'invite.js': 2046983763,
    'prereg.js': 1684494884,
    'index.css': 2261149332,
    'index.js': 1639434231,
    'join.css': 2582037683,
    'join.js': 748178609,
    'intro.css': 1689446861,
    'post.css': 1342444952,
    'module.css': 2368347222,
    'owner_photo.js': 2787686692,
    'owner_photo.css': 954613796,
    'page.js': 4115331035,
    'page.css': 1025645806,
    'page_help.css': 3014839519,
    'public.css': 3216672936,
    'public.js': 1370745423,
    'pages.css': 791854731,
    'pages.js': 3347413999,
    'groups.css': 1399102376,
    'groups.js': 2442861242,
    'groups_list.js': 3462017115,
    'groups_edit.css': 2428853467,
    'groups_edit.js': 4144320042,
    'profile.css': 3079584989,
    'profile.js': 2246332062,
    'calendar.css': 3200687086,
    'calendar.js': 4175059813,
    'wk.css': 526859196,
    'wk.js': 1889427948,
    'pay.css': 3455936119,
    'pay.js': 1315549380,
    'tagger.js': 2246443526,
    'tagger.css': 2704166027,
    'qsearch.js': 2246648013,
    'wall.css': 2093879324,
    'wall.js': 1905925749,
    'walledit.js': 2106680068,
    'thumbs_edit.css': 361289600,
    'thumbs_edit.js': 403414415,
    'mail.css': 3405659547,
    'mail.js': 4232525143,
    'email.css': 3625468312,
    'im.css': 3108717569,
    'imn.js': 2483837795,
    'im.js': 2620399366,
    'emoji.js': 582116939,
    'wide_dd.css': 1470372768,
    'wide_dd.js': 4260857284,
    'writebox.css': 4070243275,
    'writebox.js': 1878402464,
    'sharebox.js': 1742242378,
    'fansbox.js': 3553173932,
    'postbox.css': 4170744741,
    'postbox.js': 2878853436,
    'feed.js': 4150871551,
    'feed.css': 4060911493,
    'privacy.js': 1229359010,
    'privacy.css': 2039863267,
    'apps.css': 1090382157,
    'apps.js': 2701560487,
    'apps_edit.js': 1555297064,
    'apps_edit.css': 1223839495,
    'apps_check.js': 2946422271,
    'apps_check.css': 496166548,
    'settings.js': 3612753047,
    'settings.css': 161175035,
    'profile_edit.js': 2660736308,
    'profile_edit.css': 739670114,
    'profile_edit_edu.js': 2317370921,
    'profile_edit_job.js': 1509540900,
    'profile_edit_mil.js': 200684846,
    'search.js': 226843324,
    'search.css': 4095913355,
    'grid_sorter.js': 1683141245,
    'auto_list.js': 734452781,
    'suggester.js': 446460383,
    'datepicker.js': 741866923,
    'datepicker.css': 3163586330,
    'oauth_popup.css': 2783037447,
    'oauth_page.css': 1269113697,
    'oauth_touch.css': 1390775374,
    'notes.css': 1902655111,
    'notes.js': 1813954736,
    'wiki.css': 2655175474,
    'fave.js': 3186044579,
    'fave.css': 886479944,
    'widget_comments.css': 702144845,
    'widget_auth.css': 2670133601,
    'widget_community.css': 2535421841,
    'widget_contactus.css': 2062188365,
    'widget_post.css': 3306899042,
    'api/widgets/al_comments.js': 987135256,
    'api/widgets/al_auth.js': 3671685797,
    'api/widgets/al_poll.js': 507084589,
    'api/widgets/al_community.js': 4164176895,
    'api/widgets/al_contactus.js': 3313722516,
    'api/widgets/al_subscribe.js': 2508103783,
    'api/widgets/al_like.js': 437860884,
    'api/widgets/al_post.js': 3796835336,
    'api/widgets/community_messages.js': 257847949,
    'widget_community_messages.css': 1360468060,
    'al_poll.css': 3,
    'widget_recommended.css': 3653911614,
    'widgets.css': 1628119023,
    'common_light.js': 2706613887,
    'developers.css': 2192083352,
    'touch.css': 1524784846,
    'notifier.js': 3749673594,
    'notifier.css': 4234920492,
    'earthday.js': 1302273681,
    'earthday.css': 190978924,
    'restore.js': 1578098959,
    'restore.css': 1629072411,
    'restore2.css': 2556072258,
    'recover.js': 2216623723,
    'recover.css': 1708940698,
    'docs.js': 2962391756,
    'docs.css': 4062218364,
    'tags_dd.js': 2519761220,
    'tags_dd.css': 2737355895,
    'tasks.js': 2494546487,
    'tasks.css': 1111369733,
    'helpdesk.js': 152567817,
    'helpdesk.css': 2183795805,
    'tickets.js': 2175749834,
    'tickets.css': 3028813346,
    'faq.js': 1640754684,
    'faq.css': 3519965196,
    'agents.js': 3700121524,
    'agents.css': 1139617794,
    'achievements.js': 2439487380,
    'achievements.css': 2158662972,
    'sf.css': 3191509216,
    'members.css': 3492225543,
    'meminfo.css': 4088339307,
    'groupinfo.css': 2938574198,
    'bugs.js': 2994463564,
    'bugs.css': 550177605,
    'login.css': 2137396515,
    'login.js': 1559795773,
    'upload.js': 2134859430,
    'graffiti.js': 1026128914,
    'graffiti.css': 3374342273,
    'graffiti_new.js': 2423665473,
    'graffiti_new.css': 981706981,
    'abuse.js': 1131069015,
    'abuse.css': 3360978448,
    'verify.css': 262281192,
    'away.css': 3746179327,
    'stats.css': 1008513033,
    'payments.css': 1428220988,
    'payments.js': 2581364870,
    'offers.css': 1395278909,
    'offers.js': 3070210054,
    'call.js': 3752504153,
    'call.css': 1208034002,
    'aes_light.css': 53947352,
    'aes_light.js': 3923842421,
    'ads.css': 1768608005,
    'ads.js': 2016653149,
    'ads_payments.js': 899652112,
    'ads_edit.css': 4097940182,
    'ads_edit.js': 914471472,
    'ads_moder.css': 3343738821,
    'ads_moder.js': 43414103,
    'ads_tagger.js': 468647748,
    'ads_web.css': 1344536113,
    'ads_web.js': 2143800062,
    'mrtarg.js': 3995910240,
    'mrtarg.css': 1152446392,
    'health.css': 4084630120,
    'health.js': 53273640,
    'pinbar.js': 4083368255,
    'sms_office.css': 701386734,
    'sms_office.js': 3244045240,
    'help.css': 2728043455,
    'help.js': 3782508485,
    'claims.css': 1438809109,
    'claims.js': 4197337467,
    'video_embed.js': 531691495,
    'video_embed.css': 3534659853,
    'site_stats.css': 913929545,
    'site_stats.js': 1309466967,
    'blank.css': 2360807318,
    'wk_editor.js': 2315964559,
    'wk_editor.css': 2885562105,
    'btagger.js': 2682888485,
    'btagger.css': 520431514,
    'filters.js': 441951493,
    'filters_pe.js': 1797468460,
    'pe.js': 2468168913,
    'pe.css': 1936859814,
    'dev.js': 3440549172,
    'dev.css': 476430968,
    'share.css': 3172999721,
    'stickers_office.css': 2865554295,
    'stickers_office.js': 2247906357,
    'mapbox.js': 4245575080,
    'mapbox.css': 1578941304,
    'jobs.js': 1431325420,
    'jobs.css': 2306913515,
    'print.js': 1847889256,
    'print.css': 2542593047,
    'qrcode.js': 2897722391,
    'contests.css': 630790975,
    'ui.css': 3825127033,
    'ui.js': 3425210242,
    'ui_common.js': 2865647159,
    'ui_common.css': 103841784,
    'ui_media_selector.js': 1490715880,
    'ui_media_selector.css': 3745824378,
    'ui_manual.css': 26093046,
    'admin.js': 1614876408,
    'admin.css': 3392034833,
    'exchange.css': 809436780,
    'exchange.js': 43495474,
    'exchange_moder.css': 4190609504,
    'exchange_moder.js': 735536334,
    'ads_offers.css': 1250166023,
    'ads_offers.js': 990052303,
    'ads_offers_moder.css': 729706038,
    'ads_offers_moder.js': 2134368643,
    'chronicle.css': 3117643024,
    'market.css': 2078800067,
    'market.js': 1676371719,
    'vk2016.css': 1178411485,
    'landings/common.css': 344978837,
    'landings/community_message.css': 3773679594,
    'landings/wdsd.css': 950705211,
    'landings/smartfeed.css': 1217150838,
    'landings/job38.css': 257596551,
    'landings/dota.css': 3412154400,
    'vkme.css': 4239851912,
    'ui_controls.js': 2210214736,
    'highcharts.js': 607702664,
    'ui_controls.css': 1631800966,
    'selects.js': 1852657841,
    'mentions.js': 3686976691,
    'apps_flash.js': 1016765437,
    'maps.js': 302009647,
    'places.js': 636892584,
    'places.css': 2100099099,
    'map2.js': 3492395866,
    'map.css': 1691287470,
    'sort.js': 1905098063,
    'paginated_table.js': 3438566458,
    'paginated_table.css': 2072948185,
    'api/share.js': 404756598,
    'api/openapi.js': 2881649983,
    'api/xdm.js': 1965154462,
    'css_clean.js': 824960447,
    'q_frame.php': 7,
    '/swf/api_wrapper.swf': 7,
    '/swf/api_external.swf': 8,
    '/swf/api_wrapper2_0.swf': 8,
    '/swf/audio_lite.swf': 13,
    '/swf/uploader_lite.swf': 13,
    '/swf/photo_uploader_lite.swf': 17,
    '/swf/CaptureImg.swf': 12,
    '/swf/video.swf': 154,
    '/swf/vkvideochat.swf': 50,
    '/swf/vchatdevices.swf': 1,
    'snapster/style.css': 2934839730,
    'snapster/page.js': 1720549549,
    'snapster/mobile.css': 100872175,
    'snapster/common.js': 1252755421,
    'snapster/main.js': 1497766167,
    'snapster/snapster.js': 3889884962,
    'snapster/modules.js': 76227555,
    'snapster/snapster.css': 3706308972,
    'snapster/mob_templates.js': 947523457,
    'snapster/snapster_mobile.js': 2272524840,
    'snapster/snapster_mobile.css': 534332378,
    'snapster/templates.js': 437138181,
    'snapster/snapster_ui.js': 67361843,
    'snapster/notifier.js': 2711093753,
    'snapster/snapster_ui.css': 3704972475,
    'favicon': 5,
    'lang': 6740
};
var stTypes = {
    fromLib: {
        'md5.js': 1,
        'clipboard.js': 1,
        'ui_controls.js': 1,
        'highcharts.js': 1,
        'selects.js': 1,
        'sort.js': 1,
        'maps.js': 1,
        'css_clean.js': 1
    },
    fromRoot: {
        'api/share.js': 1,
        'api/openapi.js': 1,
        'api/xdm.js': 1,
        'apps_flash.js': 1,
        'mentions.js': 1,
        'map2.js': 1,
        'ui_controls.css': 1,
        'map.css': 1,
        'paginated_table.js': 1,
        'paginated_table.css': 1,
        'snapster/common.js': 1,
        'snapster/style.css': 1,
        'snapster/page.js': 1,
        'snapster/mobile.css': 1,
        'snapster/main.js': 1,
        'mobile/common.js': 1,
        'mobile/oauth.js': 1,
        'mobile/snapster.js': 1,
        'mobile/adaptive_table.css': 1,
        'mobile/base_head.css': 1,
        'mobile/base_screen.css': 1,
        'mobile/common.css': 1,
        'mobile/common_2x.css': 1,
        'mobile/full_browser.css': 1,
        'mobile/gallery.css': 1,
        'mobile/ios_device.css': 1,
        'mobile/medium_head.css': 1,
        'mobile/medium_screen.css': 1,
        'mobile/oauth_android.css': 1,
        'mobile/oauth_ios.css': 1,
        'mobile/oauth_winmobile.css': 1,
        'mobile/small_screen.css': 1,
        'mobile/snapster.css': 1,
        'mobile/wiki.css': 1
    }
};
var _rnd = 1368;
