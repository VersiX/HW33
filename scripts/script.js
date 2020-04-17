let apiKey = "c0a93423", load = false;

let searchData = {
    pageCount: 1,
    totalResults: 0,
    type: "",

    reset: () => { pageCount = 1; totalResults = 0 },
    totalPages: function () {
        return Math.trunc(this.totalResults / 10) + (this.totalResults % 10 ? 1 : 0);
    }

};

let selectedMovie = {
    imdbID: "",
    Title: "",
    Year: "",
    imgAddr: {}
};


function strToAddr(str) {
    let addr = "";
    str.split("").forEach(char => {
        if (char === " ") {
            addr += "+";
        } else {
            addr += char;
        }
    });

    return addr;
}

function ClearResults() {
    $("#movie-list").html("");
}

function onOffNoMatch(change) {
    if (change) {
        ClearResults();
        $("#noMatch").css({ display: "block" });
    } else {
        $("#noMatch").css({ display: "none" });
    }
}

function onOffLoading(change) {
    if (change) {
        $("#loading").css({ display: "block" });
    } else {
        $("#loading").css({ display: "none" });
    }
}

function printSearch(search, type, page) {
    onOffLoading(true);
    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${strToAddr(search)}${type ? "&type=" + type : ""}&page=${page}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {

            if (response.Response == "True") {
                searchData.totalResults = Number(response.totalResults);
                response.Search.forEach(result => {
                    $("#movie-list").append(`<div class="col-md-3 col-sm-6">
                    <div class="card mb-4 bg-dark movie" id="${result.imdbID}">
                        <img class="card-img-top poster"
                            src="${result.Poster}"
                            alt="${result.Title}" style="width:100%">
                        <div class="card-body bg-warning rounded-bottom">
                            <h6 class="text-secondary t">${result.Type}</h6>
                            <h5 class="card-title ">${result.Title}(${result.Year})</h5>
                        </div>
                    </div>
                    </div>`);
                });
                load = true;
            } else {
                onOffNoMatch(true);
            }
            onOffLoading(false);



            $(".movie").click(function (event) {
                $(".details-wrapper").css({ display: "flex" });
                console.log(event);

                fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${$(this).attr("id")}`)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (response) {


                        if (response.Response == "True") {
                            $(".details").html(`<div class="card" id="c${response.imdbID}">
                                    <div class="row flex-md-nowrap">
                                        <div class="col-sm">
                                            <img src="${response.Poster}"
                                                alt="" class="rounded details-img selected-poster">
                                        </div>
                                        <div class="flex-grow-1 custom-col pb-3">
                                            <h4 class="mt-3">${response.Title}</h4>
                                            <div><strong>Released: </strong>${response.Title}</div>
                                            <div><strong>Director: </strong>${response.Director}</div>
                                            <div><strong>Writer: </strong>${response.Writer}</div>
                                            <div><strong>Actors: </strong>${response.Actors}</div>
                                            <div><strong>Genre: </strong>${response.Genre}</div>
                                            <div><strong>Language: </strong>${response.Language}</div>
                                            <div><strong>Country: </strong>${response.Country}</div>
                                            <div><strong>Rated: </strong>${response.Rated}</div>
                                            <div><strong>Runtime: </strong>${response.Runtime}</div>
                                            <div><strong>imdbRating: </strong>${response.imdbRating}</div>
                                            <div><strong>Metascore: </strong>${response.Metascore}</div>
                                            <div><strong>Plot: </strong>${response.Plot}</div>
                                            <button type="button" class="btn btn-outline-dark fav-add">Add to Favorites</button>
                                        </div>
                                    </div>
                                </div>`);
                            selectedMovie.imdbID = response.imdbID;
                            selectedMovie.Title = response.Title;
                            selectedMovie.Year = response.Year;
                            selectedMovie.imgAddr = response.Poster;
                            $(".fav-add").click(function FavAdd() {

                                let movieData = {
                                    imdbID: selectedMovie.imdbID,
                                    Title: selectedMovie.Title,
                                    Year: selectedMovie.Year,
                                    imgAddr: selectedMovie.imgAddr
                                },
                                    list;

                                if (localStorage.getItem("list")) {
                                    list = JSON.parse(localStorage.getItem("list"))
                                } else {
                                    list = [];
                                }

                                list.push(movieData);
                                localStorage.setItem("list", JSON.stringify(list));

                            });
                        } else {
                        }



                    });






            })
        });



}


$("#btn-submit").click(function (event) {
    ClearResults();
    searchData.reset();
    onOffNoMatch(false);
    printSearch($("#input").val(), searchData.type = $("#selectType").val(), 1)
});

$("#btn-cancel").click(function (event) {
    $("#input").val("");
})


$(window).scroll(function (event) {
    if (($(window).scrollTop() + ($(window).height() * 1.1) >= $(document).height()) && load) {
        console.log("yes");
        if (searchData.pageCount <= searchData.totalPages()) {
            searchData.pageCount++;
            printSearch($("#input").val(), searchData.type, searchData.pageCount);
        }
        else {
            console.log("end")
        }
    }
});

$(".cover").click(() => { $(".details-wrapper").css({ display: "none" }); });

$("#fav").click(function (evt) {
    let list = JSON.parse(localStorage.getItem("list"));
    load = false;
    ClearResults();
    if (list) {
        list.forEach(item => {
            $("#movie-list").append(`<div class="col-md-3 col-sm-6">
            <div class="card mb-4 bg-dark movie" id="${item.imdbID}">
                <img class="card-img-top poster"
                    src="${item.imgAddr}"
                    alt="${item.Title}" style="width:100%">
                <div class="card-body bg-warning rounded-bottom">
                    <h6 class="text-secondary t">${item.Type}</h6>
                    <h5 class="card-title ">${item.Title}(${item.Year})</h5>
                </div>
            </div>
            </div>`);
        });
    }
    else {
        onOffNoMatch(true);
    }
});

$("#fav-del").click(function (event) {
    localStorage.clear();
})



