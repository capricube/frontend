define([
    'lodash/arrays/union',
    'common/utils/config',
    'common/utils/mediator',
    'common/modules/analytics/register',
    'common/modules/commercial/badges',
    'common/modules/component'
], function (
    union,
    config,
    mediator,
    register,
    badges,
    Component
) {

    var getTag = function () {
        var seriesAndBlogTags = config.page.blogIds.split(',').concat([config.page.seriesId]);
        return union(config.page.nonKeywordTagIds.split(','), seriesAndBlogTags).shift();
    };

    function OnwardContent(context) {
        register.begin('series-content');
        this.context = context;
        this.endpoint = '/series/' + getTag() + '.json?shortUrl=' + encodeURIComponent(config.page.shortUrl);
        this.fetch(this.context, 'html');
    }

    Component.define(OnwardContent);

    OnwardContent.prototype.ready = function (container) {
        badges.add(container);
        register.end('series-content');
        mediator.emit('modules:onward:loaded');
        mediator.emit('ui:images:upgradePictures');
    };

    OnwardContent.prototype.error = function () {
        register.error('series-content');
    };

    return OnwardContent;

});
