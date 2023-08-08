const extend = Object.assign;

function createApp(App) {
    return {
        mount(el) {
            const root = document.querySelector(el);
            const setupResult = App.setup();
            extend(App, setupResult);
            const child = App.render();
            root.appendChild(child);
        },
    };
}

function h(tag, props, children) {
    const el = document.createElement(tag);
    el.innerHTML = children;
    return el;
}

export { createApp, h };
