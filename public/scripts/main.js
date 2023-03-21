const duplicate_titles = findDuplicates(question_details[0])
addSuffixToDuplicates(question_details[0])


for(let i = 0; i<question_details[0].length; i++){
    let ul = document.getElementById('questions-collection-list')
    let li = document.createElement('li')
    let input_cb = document.createElement('input')
    input_cb.type = 'checkbox'
    input_cb.onchange = function(){tocollection(this, question_details[0][i].Id)}
    let p_title = document.createElement('p')
    p_title.className = "question-title"
    p_title.textContent = question_details[0][i].Titel
    let input_text = document.createElement('input')
    input_text.type = "text"
    input_text.className = "question-hidden-id"
    input_text.value = question_details[0][i].Id

    let button = document.createElement('button')
    button.className = 'questions-details'
    button.id = "question-details"+[i]
    let i_tag = document.createElement('i')

    i_tag.className = "fa-solid";
    i_tag.classList.add("fa-ellipsis");

    ul.appendChild(li)
    li.appendChild(input_cb)
    li.appendChild(p_title)
    li.appendChild(input_text)
    li.appendChild(button)
    button.appendChild(i_tag)

}
let questions_count = document.getElementById('questions-collection-list').childElementCount;
let questions = document.getElementById('questions-list').childElementCount;
let lastquestion = document.getElementById('questions-list');



let IDs = [], IDsC = [];
let question_IDs = [];
let tags_text = [], tagsC_text = [];

for(let i = 0;i<question_details[0].length; i++){
    question_IDs.push(question_details[0][i].Id)
}
for (let i = 0; i < tags[0].length; i++) {
    tags_text.push(tags[0][i].Tag.toLowerCase());
}
let sorted_tags = [...new Set(tags_text)];
sorted_tags = sorted_tags.sort();
sorted_tags.push("ohne Tag");
let out_tags = sorted_tags;


let checked_tags = []

for (let i = 0; i < tagsC[0].length; i++) {
    tagsC_text.push(tagsC[0][i].Tag.toLowerCase());
}
let sorted_tagsC = [...new Set(tagsC_text)];
sorted_tagsC = sorted_tagsC.sort();
if(!coll_details){
    sorted_tagsC.push("ohne Tag");
}

let out_tagsC = sorted_tagsC;

let checkedlist = [];
if (questions > 6) {
    lastquestion.lastElementChild.style.borderBottom = "";

}

if(checkedlist.length < 1){
    document.getElementById('managed-multiple-questions').innerHTML = "<p>Wähle mehrere Fragen aus bei denen ein neuer Tag hinzugefügt oder gelöscht werden soll</p>" 
}




//functions
function tocollection(val, id) {
    if (val.checked) {
        val.parentElement.style.backgroundColor = "#a2bf9d";
        checkedlist.push(id);
        document.getElementById('toCollection').value = checkedlist;
        document.getElementById('toCollection2').value = checkedlist;
        document.getElementById('addTagQ-text-multiple').value = checkedlist;
        document.getElementById('deleteTagQ-text-multiple').value = checkedlist;
    }
    else {
        val.parentElement.style.backgroundColor = "";
        let item = val.nextSibling.innerHTML;
        let index = checkedlist.indexOf(item);
        checkedlist.splice(index, 1);
        document.getElementById('toCollection').value = checkedlist;
        document.getElementById('toCollection2').value = checkedlist;
        document.getElementById('addTagQ-text-multiple').value = checkedlist;
        document.getElementById('deleteTagQ-text-multiple').value = checkedlist;
    }   

    if(checkedlist.length < 1){
       document.getElementById('managed-multiple-questions').innerHTML = "<p>Wähle mehrere Fragen aus bei denen ein neuer Tag hinzugefügt oder gelöscht werden soll</p>" 
    }
    if(checkedlist.length >= 1){
        
        document.getElementById('managed-multiple-questions').innerHTML = "<p>Ausgewählte Frage/n: </p>\n"
        let checkedlist_array = checkedlist.map(item => parseInt(item));
        let titles =""
        for(let i = 0; i<checkedlist_array.length; i++){
            let element = question_details[0].find((item) => item.Id === checkedlist_array[i]);
            titles  += element.Titel + ", "
               
        }
        document.getElementById('managed-multiple-questions').innerHTML += titles  

        // entfernen des letzten Kommas
        let q_list_manage = document.getElementById('managed-multiple-questions').innerHTML
        q_list_manage = q_list_manage.substring(0, q_list_manage.length -2)
        document.getElementById('managed-multiple-questions').innerHTML = q_list_manage

        let dropdown_tags = document.createElement('select')
        
    }
}

document.getElementById('addTagQ').addEventListener('click', function () {
    let text = document.getElementById('addTagQ-name');
    if (text.style.display == "") {
        text.style.display = "inline";
    }
    else {
        document.getElementById('addTagQ-form').submit();
    }
});
document.getElementById('addTagQ-multiple').addEventListener('click', function () {
    let text = document.getElementById('addTagQ-name-multiple');
    if (text.style.display == "") {
        text.style.display = "inline";
    }
    else {
        document.getElementById('addTagQ-form-multiple').submit();
    }
});
document.getElementById('addTagC').addEventListener('click', function () {
    let text = document.getElementById('addTagC-name');
    if (text.style.display == "") {
        text.style.display = "inline";
    }
    else {
        document.getElementById('addTagC-form').submit();
    }
});
document.getElementById('create-newCLass').addEventListener('click', function () {
    let tr = document.getElementById('content-section-headline');
    let textbar = document.getElementById('new-collection-name');
    tr.classList.toggle("content-section-headline-isactive");
    if (tr.classList.value == "content-section-headline-isactive") {
        textbar.style.display = "inline";
    } else {
        textbar.style.display = "";
    }

});

function createNewCollection(ele) {
    let form = document.getElementById('createNewCollection_form');
    if (event.key == 'Enter') {
        form.submit();
    }
}

var modal1 = document.getElementById("myModal");
var modal2 = document.getElementById("myModal2");
var modal3 = document.getElementById("myModal3");
var modal4 = document.getElementById("myModal4");

// Get the button that opens the modal
var btn = document.getElementById("import-button");
var btn2 = document.getElementById("selecting-more-questions");
let btns = [];
let btns_c = [];

for (let i = 0; i < question_details[0].length; i++) {
    btns[i] = document.getElementById("question-details" + [i]);
}

for(let i = 0; i< collections[0].length; i++){
    btns_c[i] = document.getElementById("collection-details" + [i]);
}
// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close")[1];
var span2 = document.getElementsByClassName("close")[2];
var span3 = document.getElementsByClassName("close")[3];
var span4 = document.getElementsByClassName("close")[0];
// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal1.style.display = "block";
};
btn2.onclick = function () {
    modal4.style.display = "block";
};
for (let i = 0; i < questions_count; i++) {
        btns[i].onclick = function () {
            modal2.style.display = "block";

            document.getElementById('question-detail-name').innerHTML = question_details[0][i].Titel
            document.getElementById('question-description').innerHTML = question_details[0][i].Beschreibung
            document.getElementById('question-answer').innerHTML = cleanCode(question_details[0][i].Antwort)




            for (let j = 0; j < question_details[0].length; j++) {

                if (question_details[0][j].Titel == btns[i].parentElement.children[1].innerHTML) {
                    document.getElementById("addTagQ-text").value = question_details[0][j].Id;
                    document.getElementById("deleteTagQ-text").value = question_details[0][j].Id;
                    document.getElementById("deleteQuestion-text").value = question_details[0][j].Id;
                    for (let k = 0; k < tags[0].length; k++) {
                        if (tags[0][k].QId == question_details[0][j].Id) {
                            let newTag = document.createElement("div");
                            newTag.className = "tag";
                            let newTagName = document.createElement("button");
                            newTagName.className = "tag-name";
                            newTagName.classList.add("capitalize");
                            newTagName.innerText = tags[0][k].Tag;
                            newTag.appendChild(newTagName);
                            document.getElementById("question-details-tags").appendChild(newTag);
                            newTag.onclick = function () {
                                document.getElementById('deleteTagQ-tag').value = newTagName.innerHTML;
                                for (let x = 0; x < document.getElementsByClassName('tag').length; x++) {
                                    document.getElementsByClassName('tag')[x].style.borderColor = "";
                                }
                                this.style.borderColor = "green";
                            };
                        }
                    }
                }
            }

        };
    }
for(let i = 0; i<collections[0].length; i++){
    btns_c[i].onclick = function () {
       modal3.style.display = "block"; 
       document.getElementById('collection-tags-name').innerHTML = btns_c[i].parentElement.children[1].innerHTML;
       document.getElementById("addTagC-text").value = collections[0][i].Name;
        document.getElementById("deleteTagC-text").value = collections[0][i].Name;
      for(let j = 0; j<tagsC[0].length; j++){
          if(tagsC[0][j].CId == collections[0][i].Id){
                let newTag = document.createElement("div");
                newTag.className = "tag";
                let newTagName = document.createElement("button");
                newTagName.className = "tag-name";
                newTagName.classList.add("capitalize");
                newTagName.innerText = tagsC[0][j].Tag;
                newTag.appendChild(newTagName);
                document.getElementById("collection-tags-list").appendChild(newTag);
                newTag.onclick = function () {
                document.getElementById('deleteTagC-tag').value = newTagName.innerHTML;
                for (let x = 0; x < document.getElementsByClassName('tag').length; x++) {
                document.getElementsByClassName('tag')[x].style.borderColor = "";
                }
                this.style.borderColor = "green";
                }  ;
          }
      }
       
    };
}

// When the user clicks on <span> (x), close the modal
span1.onclick = function () {
    modal1.style.display = "none";
};
span2.onclick = function () {
    modal2.style.display = "none";
    let parent = document.getElementById('question-details-tags');

    // close the open dropdown text boxes
    document.getElementById("question-description").style.display = ""
    document.getElementById("description-arrow").className = "fa-solid fa-chevron-down"
    document.getElementById("question-answer").style.display = ""
    document.getElementById("answer-arrow").className = "fa-solid fa-chevron-down"

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};
span3.onclick = function () {
    modal3.style.display = "none";
    let parent = document.getElementById('collection-tags-list');
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};
span4.onclick = function () {
    modal4.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal1) {
        modal1.style.display = "none";
    }
    if (event.target == modal4) {
        modal4.style.display = "none";
    }
    if (event.target == modal2) {
        modal2.style.display = "none";

        // close the open dropdown text boxes
        document.getElementById("question-description").style.display = ""
        document.getElementById("description-arrow").className = "fa-solid fa-chevron-down"
        document.getElementById("question-answer").style.display = ""
        document.getElementById("answer-arrow").className = "fa-solid fa-chevron-down"

        let parent = document.getElementById('question-details-tags');
       
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    if (event.target == modal3) {
        modal3.style.display = "none";
        let parent = document.getElementById('collection-tags-list');
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
}


function selectCollection(val) {
    let boxes = document.querySelectorAll('.collectionCheck');
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].checked = false;

    }
    document.getElementById('export-button').value = val.nextSibling.nextSibling.children[0].children[0].innerHTML;
    val.checked = true;
    document.getElementById('forCollectionName').value = val.nextSibling.nextSibling.children[0].children[0].innerHTML;
    document.getElementById('forCollectionName2').value = val.nextSibling.nextSibling.children[0].children[0].innerHTML;

}

let collection_count = document.getElementById('collection-list').childElementCount;
let collection_elememts = document.getElementById('collection-list').children;
/*if (collection_state != false) {
    for (let i = 0; i < collection_count; i++) {
        if ((collection_elememts[i].children[1].children[0].children[0].innerHTML) == collection_state) {
            collection_elememts[i].style.backgroundColor = "#a2bf9d";
        }
    }
}
*/


//Searching Tags
function show_tags() {
    removeAllChildNodes(document.getElementById("searching-tags-content"));

    // Create Tag Elements 
    for (let i = 0; i < out_tags.length; i++) {
        let newTag = document.createElement("div");
        newTag.className = "tag";
        newTag.classList.add("tags-searchingArea");
        let newTagName = document.createElement("button");
        newTagName.className = "tag-name";
        newTagName.classList.add("capitalize");
        if (out_tags[i].toLowerCase().includes("wise")) {
            newTagName.innerText = out_tags[i].replace("wise", "WiSe");
        }
        if (out_tags[i].toLowerCase().includes("sose")) {
            newTagName.innerText = out_tags[i].replace("sose", "SoSe");
            }
            
        if(!(out_tags[i].toLowerCase().includes("wise")) && !(out_tags[i].toLowerCase().includes("sose"))){

            newTagName.innerText = out_tags[i];
        }
       
        newTag.appendChild(newTagName);
        document.getElementById("searching-tags-content").appendChild(newTag);

        newTag.onclick = function () {

            if (this.style.borderColor == "green") {
                this.style.borderColor = "";
                if(document.getElementById('tag-icon').className == 'fa-solid fa-tag'){
                    search_for_tag_1(this, "delete")
                }else{
                    search_for_tag_2(this, "delete")
                }
            }   
            else {
                this.style.borderColor = "green";
                if(document.getElementById('tag-icon').className == 'fa-solid fa-tag'){
                    search_for_tag_1(this, "add")
                }else{
                    search_for_tag_2(this, "add")
                }
            }

            let docs = document.getElementById('searching-tags-content').children;
            let doc = [];
            let counter_green = 0;
            for(let i = 0; i<docs.length ; i++){
                if(docs[i].style.borderColor == "green"){
                    doc.push(docs[i]);
                counter_green ++;
                }
            }
            if(counter_green == 1){
                let newTag = document.createElement("div");
                newTag.className = "tag";
                newTag.classList.add("tags-searchingArea");
                let newTagName = document.createElement("button");
                newTagName.className = "tag-name";
                newTagName.classList.add("capitalize");
                newTagName.id = "show-selected-tag-tag";
                newTagName.innerText = doc[0].firstChild.innerHTML;
                newTag.appendChild(newTagName);
                document.getElementById("deleteTagQ-tag-multiple").value = doc[0].firstChild.innerHTML;
                
            }
        };
    }
    removeAllChildNodes(document.getElementById("searching-tagsC-content"));
    for (let i = 0; i < out_tagsC.length; i++) {
        let newTag = document.createElement("div");
        newTag.className = "tag";
        newTag.classList.add("collection-tag-buttons");
        newTag.classList.add("tags-searchingArea");
        let newTagName = document.createElement("button");
        newTagName.className = "tag-name";
        newTagName.classList.add("capitalize");
        if (out_tagsC[i].toLowerCase().includes("wise")) {
            newTagName.innerText = out_tagsC[i].replace("wise", "WiSe");
        }
        if (out_tagsC[i].toLowerCase().includes("sose")) {
            newTagName.innerText = out_tagsC[i].replace("sose", "SoSe");
            }
        if(!(out_tagsC[i].toLowerCase().includes("wise")) && !(out_tagsC[i].toLowerCase().includes("sose"))){
            newTagName.innerText = out_tagsC[i];
        }
        newTag.appendChild(newTagName);
        document.getElementById("searching-tagsC-content").appendChild(newTag);
        newTag.onclick = function () {

            if (this.style.borderColor == "green") {
                this.style.borderColor = "";
                search_for_tagC(this);
            }
            else {
                this.style.borderColor = "green";
                search_for_tagC(this);
            }

        };
    }
    
}

//filter out tags suitable for search
function filter_tags() {
    out_tags = [];
    let val = document.getElementById('input-search-tags').value;
    val = val.toLowerCase();
    let arr = sorted_tags;
    if (val == "" || val.length < 1) { /* JA 1.7.22 */
        out_tags = sorted_tags;
    } else {
        let matches = arr.filter(s => s.includes(val));
        /* JA 1.7.22 */
        out_tags.push(matches);
        out_tags = out_tags[0]
        //warum die nächsten Zeilen? Die obere sorgt dafür, dass ein beliebiger Teil der Zeichenkette passt. 
        //Der nachfolgende Teil sorgt dafür, dass nur das geliefert wird, was am Anfang übereinstimmt, richtig?
        //mir gefällt es besser wenn mindestens 3 Buchstaben irgendwo im Tag passen
        /*for (let i = 0; i < matches.length; i++) {
            for (let j = 0; j < val.length; j++) {
                if (matches[i][0 + j] == val[j]) {
                    if (out_tags.length > 0) {
                        if (!out_tags.includes(matches[i])) {
                            out_tags.push(matches[i]);
                        }
                    } else {
                        out_tags.push(matches[i]);
                    }
    
                }
            }
        }
        /* JA 1.7.22 */
    }
    show_tags();
}

function filter_tagsC() {
    out_tagsC = [];
    let val = document.getElementById('input-search-tagsC').value;
    val = val.toLowerCase();
    let arr = sorted_tagsC;

    if (val == "" || val.length < 1) {
        out_tagsC = sorted_tagsC;
    }
    else {
        let matches = arr.filter(s => s.includes(val));
        /* JA 1.7.22 */
        out_tagsC.push(matches);
        out_tagsC = out_tagsC[0]
        /*
        let matches = arr.filter(s => s.includes(val));
        for (let i = 0; i < matches.length; i++) {
            for (let j = 0; j < val.length; j++) {
                if (matches[i][0 + j] == val[j]) {
                    if (out_tagsC.length > 0) {
                        if (!out_tagsC.includes(matches[i])) {
                            out_tagsC.push(matches[i]);
                        }
                    } else {
                        out_tagsC.push(matches[i]);
                    }
    
                }
            }
        }*/
    
    }
    show_tags();
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function search_for_tag(tag_element) {
    
    let tag = tag_element.firstChild.innerHTML;
    let counter = count_clicked_tags("question");
    let dupes = []; //Contains the IDs that 
    let question_counter = document.getElementById("questions-collection-list").children;
    let shown_questions = [];

    
    for (let i = 0; i < question_counter.length; i++) {
        for (let j = 0; j < question_details[0].length; j++) {
            if (question_counter[i].children[1].innerHTML == question_details[0][j].Titel) {
                shown_questions.push({ Titel: question_details[0][j].Titel, Id: question_details[0][j].Id });
            }
        }
    }
    
     if(tag_element.style.borderColor == "green") {
        for (let i = 0; i < tags[0].length; i++) { //Get all IDs of the clicked Tags 
            if (tags[0][i].Tag.toLowerCase() == tag) {
                IDs.push(tags[0][i].QId);
            }
        }
    } 
    else{
        for (let i = 0; i < tags[0].length; i++) {
            if (tags[0][i].Tag.toLowerCase() == tag) {
                const index = IDs.indexOf(tags[0][i].QId);
                if (index > -1) {
                    IDs.splice(index, 1);
                }
            }
        }
    }
    
    IDs.sort(function (a, b) {
        return a - b;
    });
     if(counter == 1){
        dupes = IDs;
    }
    else{
        for(let i = 0; i<IDs.length; i++){ // get all IDs  which occur in every tag
            if(IDs.filter(x => x == IDs[i]).length == counter){
                if(!dupes.includes(IDs[i])){
                    dupes.push(IDs[i]);                      
                }
            }
        }
    }
   
    if(tag_element.firstChild.innerHTML == "ohne Tag" && counter == 1){
        
        for(let i = 0; i<shown_questions.length; i++){
            for(let j = 0; j<tags[0].length; j++){
                if(shown_questions[i].Id == tags[0][j].QId){
                    question_counter[i].style.display = "none";
                }
            }
        }
        return;
    }
    for(let i = 0; i<question_counter.length; i++){ //display every question that contains every tag
        if(dupes.length == 0 && counter != 0){
            question_counter[i].style.display = "none";  
        }
        if(dupes.length == 0 && counter == 0){
            question_counter[i].style.display = "";
        }
        else{
            for(let j = 0; j<dupes.length; j++){
                if(shown_questions[i].Id == dupes[j]){
                    question_counter[i].style.display = "";
                break;
                }
                else{
                    question_counter[i].style.display = "none";    
                }
            }       
        }
       
    }
}

function search_for_tagC(tag_element){
    let tag = tag_element.firstChild.innerHTML.toLowerCase();
    let counter = count_clicked_tags("collection");
    let dupes = []; //Contains the IDs that 
    let id;
    
    if(tag_element.style.borderColor == "green") {
        for (let i = 0; i < tagsC[0].length; i++) { //Get all IDs of the clicked Tags 
            if (tagsC[0][i].Tag.toLowerCase() == tag) {
                IDsC.push(tagsC[0][i].CId);
            }
        }
    } 
    else{
        for (let i = 0; i < tagsC[0].length; i++) {
            if (tagsC[0][i].Tag.toLowerCase() == tag) {
                const index = IDsC.indexOf(tagsC[0][i].CId);
                if (index > -1) {
                    IDsC.splice(index, 1);
                }
            }
        }
    }
    
    IDsC.sort(function (a, b) {
        return a - b;
    }); 
    if(counter == 1){
        dupes = IDsC;
    }
    else{
        for(let i = 0; i<IDsC.length; i++){ // get all IDs  which occur in every tag
            if(IDsC.filter(x => x == IDsC[i]).length == counter){
                if(!dupes.includes(IDsC[i])){
                    dupes.push(IDsC[i]);                     
                }
            }
        }
    }
    let collectionChildren = document.getElementById('collection-list').childElementCount;
    let collectionChild = document.getElementById('collection-list').children;
    if(tag_element.firstChild.innerHTML == "ohne Tag" && counter == 1){
        for(let i = 0; i<collectionChildren; i++){
            for(let j = 0; j<tagsC[0].length; j++){
                if(collections[0][i].Id == tagsC[0][j].CId){
                    collectionChild[i].style.display = "none";
                }
            }
        }
        return;
    }
    
   
    
    for(let i = 0; i<collectionChildren; i++){ //display every collection that contains every tag
        if(dupes.length == 0 && counter != 0){
            collectionChild[i].style.display = "none";  
        }
        if(dupes.length == 0 && counter == 0){
            collectionChild[i].style.display = "";
        }
        for(let j = 0; j<collections[0].length; j++){
            if(collectionChild[i].children[1].children[0].value == collections[0][j].Name){ 
            
                id = collections[0][j].Id;
            }
        }
        for(let j = 0; j<dupes.length; j++){
            if(id == dupes[j]){
                collectionChild[i].style.display = "";
            break;
            }
            else{
                collectionChild[i].style.display = "none";    
            }
        }   
    }
}

function count_clicked_tags(state){
    let counter = 0;
    if(state == "collection"){
        for(let i = 0; i<document.getElementById('searching-tagsC-content').childElementCount; i++){
            if(document.getElementById('searching-tagsC-content').children[i].style.borderColor == "green"){
                counter ++;
            }
        }    
    }
    if(state == "question"){
        for(let i = 0; i<document.getElementById('searching-tags-content').childElementCount; i++){
            if(document.getElementById('searching-tags-content').children[i].style.borderColor == "green"){
                counter ++;
            }
        }       
    }
    return counter;
}

function filter_questions(){
    let val = document.getElementById('input-search-questions').value;
    let question_counter = document.getElementById("questions-collection-list").children;
    let shown_questions = [];
    
    for(let i = 0; i<document.getElementById('searching-tags-content').childElementCount; i++){
        document.getElementById('searching-tags-content').children[i].style.borderColor = "#C4C4CC";
    }
    
    for (let i = 0; i < question_counter.length; i++) {
        for (let j = 0; j < question_details[0].length; j++) {
            if (question_counter[i].children[1].innerHTML == question_details[0][j].Titel) {
                shown_questions.push(question_details[0][j].Titel.toLowerCase());
            }
        }
    }

    if(val == ""){
        for(let i = 0; i<question_counter.length; i++){
            question_counter[i].style.display = "";
        }
        return;
    }
    
        let matches = shown_questions.filter(s => s.includes(val));
        let test = matches.filter(s => s.includes(question_counter[0].children[1].innerHTML.toLowerCase()))
     
        for(let i = 0; i<question_counter.length; i++){
           if(!matches.filter(s => s.includes(question_counter[i].children[1].innerHTML.toLowerCase())).length != 0){
               question_counter[i].style.display = "none";
           }else{
               question_counter[i].style.display = "";
           }
        }
    
}

document.getElementById('lupe_q').onclick = function(){
    let textfield = document.getElementById('search-tab-questions')
    
    if(textfield.style.display == "flex"){
        textfield.style.display = "none"
        return;
        
    }if(textfield.style.display == "" || textfield.style.display == "none"){
    textfield.style.display = "flex";
    }
}


show_tags();


for(let i = 0; i<document.getElementById('collection-list').childElementCount; i++){
    if(document.getElementById('collection-list').children[i].style.backgroundColor == "rgb(162, 191, 157)"){
        for(let j = 0; j<document.getElementsByClassName('collection-tag-buttons').length; j++){
            document.getElementsByClassName('collection-tag-buttons')[j].style.pointerEvents = "none";
        }

    }
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

function insert(main_string, ins_string, pos) {
    if(typeof(pos) == "undefined") {
     pos = 0;
   }
    if(typeof(ins_string) == "undefined") {
     ins_string = '';
   }
    return main_string.slice(0, pos) + ins_string + main_string.slice(pos);
}

function cleanCode(code){
    let index_open = getAllIndexes(code, "<");
    
    cleaned_code = code;
    for(let i = 0; i<index_open.length; i++){
        cleaned_code = cleaned_code.replace("<", "&lt;")
    }

    let index_close = getAllIndexes(code, ">");

    for(let i = 0; i<index_close.length; i++){
        cleaned_code = cleaned_code.replace(">", "&gt;")
    }
   
    return cleaned_code
}


document.getElementById("show-question-description").onclick = function(){
    let disp = document.getElementById("question-description")
    if(disp.style.display == ""){
        disp.style.display = "inline"
        document.getElementById("description-arrow").className = "fa-solid fa-chevron-up"
    }else{
        disp.style.display = ""
        document.getElementById("description-arrow").className = "fa-solid fa-chevron-down"
    }
}

document.getElementById("show-question-answer").onclick = function(){
    let disp = document.getElementById("question-answer")
    if(disp.style.display == ""){
        disp.style.display = "inline"
        document.getElementById("answer-arrow").className = "fa-solid fa-chevron-up"
    }else{
        disp.style.display = ""
        document.getElementById("answer-arrow").className = "fa-solid fa-chevron-down"
    }
}



//change the type of search with tags
//if tag button on Button List is clicked, change image
document.getElementById("change-tag-type").onclick = function(){

    parent_tags = document.getElementById('searching-tags-content')
    for(let i = 0; i<parent_tags.childElementCount; i++){
        if(parent_tags.children[i].style.borderColor == "green"){
            parent_tags.children[i].firstChild.click();
        }
    }

    if(document.getElementById("tag-icon").classList.contains("fa-tag")){
        document.getElementById("tag-icon").className = "fa-solid fa-tags";
        document.getElementById("change-tag-type").title = "Aufgaben, passend zu mindestens einem Tag"
    }
    else{
        document.getElementById("tag-icon").className = "fa-solid fa-tag";
        document.getElementById("change-tag-type").title = "Aufgaben, passend zu allen Tags"
    }
}


function create_question_element(){
    let ul = document.getElementById("questions-collection-list");

}

function search_for_tag_2(t, operation){
    //variables 
    let question_counter = document.getElementById("questions-collection-list").children;
    
    //set all questions to default
    for(let i = 0; i<question_counter.length; i++){
        question_counter[i].style.display = "";
    }

   //prepare list of all checked tags
    if(operation == "add"){
        checked_tags.push(t.children[0].innerHTML.toLowerCase());
    }
    else{
        const index = checked_tags.indexOf(t.children[0].innerHTML.toLowerCase());
        checked_tags.splice(index, 1);
    }
    
    //get all Ids of questions with suitable tags
    let q_ids = []
    for(let i = 0; i<checked_tags.length; i++){
        let t = getAllIndexes(tags_text, checked_tags[i])
        for(j = 0; j<t.length; j++){
            q_ids.push(tags[0][t[j]].QId)
        }
    }

    let qid_taglist = []
    for(let i = 0; i< tags[0].length; i++){
        qid_taglist.push(tags[0][i].QId)
    }
    qid_taglist = qid_taglist.sort()

    //if "ohne tag" is clicked all ids that not have any tags should be in the q_ids array
    if(checked_tags.includes("ohne Tag")){
       q_ids.push(question_IDs.filter(x => !qid_taglist.includes(x)));
    }

    for(let i = 0; i<question_counter.length; i++){
        let question_element_id = question_counter[i].children[2].value

        if(!q_ids.includes(parseInt(question_element_id))){
            question_counter[i].style.display = "none";
        }
    }

    //if no tag is clicked
    if(checked_tags.length == 0){
        //set all questions to default
        for(let i = 0; i<question_counter.length; i++){
            question_counter[i].style.display = "";
        }
    }
}   



function search_for_tag_1(t, operation){
    //variables 
    let question_counter = document.getElementById("questions-collection-list").children;

    //set all questions to default
    for(let i = 0; i<question_counter.length; i++){
        question_counter[i].style.display = "";
    }

    //prepare list of all checked tags
    if(operation == "add"){
        checked_tags.push(t.children[0].innerHTML.toLowerCase());
    }
    else{
        const index = checked_tags.indexOf(t.children[0].innerHTML.toLowerCase());
        checked_tags.splice(index, 1);
    }

    //get all Ids of questions with suitable tags
    let q_ids = []
    for(let i = 0; i<checked_tags.length; i++){
        let t = getAllIndexes(tags_text, checked_tags[i])
        for(j = 0; j<t.length; j++){
            q_ids.push(tags[0][t[j]].QId)
        }
    }
    //all qids with tags
    let qid_taglist = []
    for(let i = 0; i< tags[0].length; i++){
        qid_taglist.push(tags[0][i].QId)
    }
    qid_taglist = qid_taglist.sort()

    //if "ohne tag" is clicked all ids that not have any tags should be in the q_ids array
    if(checked_tags.includes("ohne Tag")){
        q_ids.push(question_IDs.filter(x => !qid_taglist.includes(x)));
        q_ids = q_ids.flat()
    }

    let multiple_ids = []
    for(let i = 0; i<q_ids.length; i++){
        let number_of_occur = q_ids.filter(x => x==q_ids[i]).length
        if(number_of_occur == checked_tags.length){
            multiple_ids.indexOf(q_ids[i]) == -1 ? multiple_ids.push(q_ids[i]) : console.log()
        }
    }
    multiple_ids = multiple_ids.sort()


    for(let i = 0; i<question_counter.length; i++){
        let question_element_id = question_counter[i].children[2].value
        if(!multiple_ids.includes(parseInt(question_element_id))){
            question_counter[i].style.display = "none";
        }
    }
    //if no tag is clicked
    if(checked_tags.length == 0){
        //set all questions to default
        for(let i = 0; i<question_counter.length; i++){
            question_counter[i].style.display = "";
        }
    }
}

function findDuplicates(arr) {
    var duplicates = [];
    var counts = {};
    arr.forEach(function(item) {
        if (counts[item.Titel]) {
            counts[item.Titel]++;
            if (counts[item.Titel] === 2) {
                duplicates.push(item.Titel);
            }
        } else {
            counts[item.Titel] = 1;
        }
    });
    return duplicates;
}


function addSuffixToDuplicates(arr) {
    var counts = {};
    arr.forEach(function(item) {
        if (counts[item.Titel]) {
            counts[item.Titel]++;
            item.Titel += " (" + counts[item.Titel] + ")";
        } else {
            counts[item.Titel] = 1;
        }
    });
    return arr;
}
