$(document).ready(function(){
    var data = JSON.parse(localStorage.getItem('tasks')) || [];
    var itemsPerPage = 5;
    var currentPage = 1;
    console.log("document is ready");

    function displayTableData() {
        $('#dataRows').empty();
        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        var displayedData = data.slice(startIndex, endIndex);
        displayedData.forEach(function(item){
            addRow(item.taskTitle, item.taskDesc, item.startDate, item.endDate);
        });
    }

    //add button
    $("#addBtn").click(function(event){
        event.preventDefault();
        console.log("Add button clicked."); // Add this line to check if the button click event is triggered

        var taskTitle = $("#taskTitle").val();
        var taskDesc = $("#taskDesc").val();
        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        if(taskTitle !=='' && taskDesc !=='' && startDate !=='' && endDate !=='' ){
            data.push({taskTitle: taskTitle, taskDesc: taskDesc, startDate: startDate, endDate: endDate});
            addRow(taskTitle,taskDesc,startDate,endDate);
            $("#taskForm")[0].reset();

            //update local storage after inserting th new data
            localStorage.setItem('tasks', JSON.stringify(data));
        }else{
            alert("Please fill all fields!")
        }
    });

    //insert data query
    function addRow(taskTitle, taskDesc, startDate, endDate){
        var newRow = "<tr><td>" + taskTitle + "</td><td>" + taskDesc + "</td><td>" + startDate + "</td><td>" + endDate + "</td><td><button class='m-1 btn btn-sm btn-primary editBtn'>Edit</button><button class='m-1 btn btn-sm btn-danger deleteBtn'>Delete</button></td></tr>";
        $("#dataRows").append(newRow);
    }

    //edit button
    $(document).on("click", ".editBtn", function(){
        var index = $(this).closest("tr").index();
        var rowData = data[index];
        $("#taskTitle").val(rowData.taskTitle);
        $("#taskDesc").val(rowData.taskDesc);
        $("#startDate").val(rowData.startDate);
        $("#endDate").val(rowData.endDate);
        data.slice(index, 1);
        updateTable();

        //update local storage after edititng
        localStorage.setItem('tasks', JSON.stringify(data));
    });

    //update data query
    function updateTable(){
        $('#dataRows').empty();
        data.forEach(function(item){
            addRow(item.taskTitle, item.taskDesc, item.startDate,item.endDate)
        });
    }

    //delete data query
    $(document).on("click", ".deleteBtn", function(){
        var index = $(this).closest("tr").index();
        data.splice(index, 1)
        updateTable();

        //update local storage after deleting 
        localStorage.setItem('tasks', JSON.stringify(data));
    });
    
    //search functionality
    $("#searchInput").on("keyup", function(){
        var value = $(this).val().toLowerCase();
        $("#dataRows tr").filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    function updatePagination() {
        $('#pagination').empty();
        var totalPages = Math.ceil(data.length / itemsPerPage);
        for (var i = 1; i <= totalPages; i++) {
            var btn = $('<button class="page-link bg-primary text-dark">' + i + '</button>');
            btn.click(function() {
                currentPage = parseInt($(this).text());
                displayTableData();
                updatePagination();
            });
            $('#pagination').append(btn);
        }
    }
    updateTable();

    updatePagination();
});