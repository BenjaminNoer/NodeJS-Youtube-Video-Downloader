//Run when index.html finishes loading
document.addEventListener("DOMContentLoaded", function()
{
    const host = "http://localhost:5000/";

    document.querySelector("#get-video-info-btn").addEventListener("click", function(){
        //Remove videoURL whitepsace
        let videoURL = document.querySelector("#videoURL").value.trim();

        if (videoURL.length == 0)
        {
            alert("Please enter a valid Youtube video link");
            return;
        }  

        //Get video information
        fetch(host + "videoInfo?videoURL=" + videoURL).then(function(response){
            return response.json();
        }).then(function(data){
            console.log(data);

            //Update document elements with video information
            let detailsNodes = {
                thumbnail:document.querySelector(".video-data .thumbnail img"),
                title:document.querySelector(".video-data .info h2"),
                description:document.querySelector(".video-data .info p"),
                videoURL:document.querySelector(".video-data .controls #video-url"),
                downloadOptions:document.querySelector(".video-data .controls #download-options"),
            }

            //Used to add html to index.html
            let html = "";
            
            //Add all formats to quality selector
            for (let i = 0; i < data.formats.length; i++)
            {
                if (data.formats[i].container != "mp4")
                {
                    //Skip quality setting if it is not in MP4 fomat
                    continue;
                }

                //Add new quality setting to selector
                html += `
                    <option value="${data.formats[i].itag}">
                        ${data.formats[i].container} - ${data.formats[i].qualityLabel}
                    </option>
                `;
            }

            //Get HD thumbnail image
            detailsNodes.thumbnail.src = data.videoDetails.thumbnails[data.videoDetails.thumbnails.length - 1].url;

            //Change visible title and description text
            detailsNodes.title.innerText = data.videoDetails.title;
            detailsNodes.description.innerText = data.videoDetails.description;

            detailsNodes.videoURL.value = videoURL;
            detailsNodes.downloadOptions.innerHTML = html;

            //Show .video-data class and automatically scroll down to show it
            document.querySelector(".video-data").style.display = "block";
            document.querySelector(".video-data").scrollIntoView({behavior:"smooth"});
        }).catch(function(error){
            alert("Something went wrong");
            console.log(error);
        });
    });

    document.querySelector("#download-btn").addEventListener("click", function(){
        let videoURL = document.querySelector("#video-url").value;
        let itag = document.querySelector("#download-options").value;

        //Download video
        window.open(host + "download?videoURL=" + videoURL + "&itag=" + itag);
    });
});
