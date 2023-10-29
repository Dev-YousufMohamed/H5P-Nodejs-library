import * as H5P from '@lumieducation/h5p-server';

export default function render(
    editor: H5P.H5PEditor
): (req: any, res: any) => any {
    return async (req, res) => {
        const contentIds = await editor.contentManager.listContent();
        const contentObjects = await Promise.all(
            contentIds.map(async (id) => ({
                content: await editor.contentManager.getContentMetadata(
                    id,
                    req.user
                ),
                id
            }))
        );
        res.send(`
        <!doctype html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>H5P</title>
        </head>
        <body>
            <script>
                window.onload = function() {
                    let h5phref = '';
                    let backto = location.hash.replace('#','');
                    let h5pWindow = open('https://testinteractive.onrender.com/h5p/new', '', 'titlebar=no,toolbar=no,status=no,scrollbars=no,menubar=no,top=100,left=240,width=950,height=600');
                    h5pWindow.onload = function() {
                        let checkInterval = setInterval(function() {
                            if (h5pWindow.location.href !== 'https://testinteractive.onrender.com/h5p/new') {
                                h5phref = h5pWindow.location.href;
                                clearInterval(checkInterval);
                                h5pWindow.close();
                                window.opener.postMessage(h5phref, backto);
                            }
                        }, 500);
                    };
                }
            </script>
        </body>
        `);
    };
}
