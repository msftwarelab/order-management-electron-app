const remote = require("electron").remote;

    document.addEventListener("keydown", event => {

        switch (event.key) {
            case "Escape":
                if (remote.getCurrentWindow()) {
                    remote.getCurrentWindow().close();
                }
                break;
             }
    });