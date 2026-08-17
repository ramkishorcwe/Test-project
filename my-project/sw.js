self.addEventListener('install', function(e) {
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    e.waitUntil(self.clients.claim());
});

self.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'TASK_START') {
        var task = e.data.task;

        var options = {
            body: "\u0906\u092A\u0915\u0947 Task '" +
                  task.subj +
                  " \u2014 " +
                  task.topic +
                  "' \u0915\u093E \u0938\u092E\u092F \u0936\u0941\u0930\u0942 \u0939\u094B \u0917\u092F\u093E \u0939\u0948\u0964 \u0915\u0943\u092A\u092F\u093E Timer \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902\u0964",

            icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'><rect width='96' height='96' fill='%231A1A2E' rx='16'/><text y='68' x='48' text-anchor='middle' font-size='56'>📚</text></svg>",

            badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'><rect width='96' height='96' fill='%23059669' rx='48'/><text y='68' x='48' text-anchor='middle' font-size='56'>✓</text></svg>",

            tag: 'leelan-task-' + task.time,
            requireInteraction: true,
            vibrate: [200, 100, 200, 100, 200],
            renotify: true,

            actions: [
                {
                    action: 'start',
                    title: '▶ Timer Start'
                },
                {
                    action: 'skip',
                    title: '⏭ Skip Task'
                }
            ],

            data: {
                task: task,
                url: self.location.href
            }
        };

        e.waitUntil(
            self.registration.showNotification(
                '⏰ Task Time Started',
                options
            )
        );
    }
});

self.addEventListener('notificationclick', function(e) {
    e.notification.close();

    var task =
        e.notification.data &&
        e.notification.data.task;

    e.waitUntil(
        self.clients
            .matchAll({
                type: 'window',
                includeUncontrolled: true
            })
            .then(function(clients) {

                var client =
                    clients.length > 0
                        ? clients[0]
                        : null;

                if (client) {

                    client.postMessage({
                        type: e.action === 'skip'
                            ? 'SKIP_TASK'
                            : 'START_TIMER',
                        task: task
                    });

                    client.focus();

                } else {

                    self.clients.openWindow(
                        e.notification.data.url || '/'
                    );
                }
            })
    );
});
