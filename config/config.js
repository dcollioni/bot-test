module.exports = function() {
    var messenger = {
            verifyToken: "superplayer_lets_rock",
            graphUrl: "https://graph.facebook.com/v2.6"
        },
        api = {

        },
        s3 = {
            cardImage: "https://s3.amazonaws.com/sp.publicdocuments/images/bot-default.jpg"
        };

    if (process.env.ENV == 'production')
    {
        messenger.token = "CAADH99bPVBUBABUOgWkZBuJivN4atcLc7yrGG5a8vHmvlyhRhDEch6PJH1xCzDIh08bSBIZCfqh1AeUvN2NbVbzkpZBCTLNAFY3xfvJEbe8LETcLs2H2bmgT3ECxbOm9ZCxe6IZADVEmmfSNNWYE4eGFlyfMfGzqpQ8b1ZB8U8HIcKe99LmPQbIfg3rdvv1r2RGqv9KjCH6gZDZD";
        api.baseUrl = "http://ec2-54-226-237-234.compute-1.amazonaws.com";
    }
    else
    {
        messenger.token = "CAAHp6HIb7KwBAJxahAYNoXuef5LvY4uMcBZCAtKArS9nTaRe8e5N9LmMDse8MBZC7JJEJoPNiZB24IoZBYFh7U63TeA17T2rHzLF41Baxv4eu7A0gs2zHnTuKL6ResLDzwx4CINvehEsPKl1YO7J0TqYoNiYclS2QkI7ufT2fZATwhxYhOrJYW98b41z97A6s0CsarsYNfgZDZD";
        api.baseUrl = "http://splchat-alpha.herokuapp.com";
    }

    return {
        messenger: messenger,
        api: api,
        s3: s3
    };
};
