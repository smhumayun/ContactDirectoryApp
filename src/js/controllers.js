angular.module('contactDirectoryWebApp.controllers', [])
    .controller('ContactListController', function($scope, $state, $window, Contact) {
        $scope.pageSizeOptions = [
            { key: '10', value: '10'},
            { key: '20', value: '20'},
            { key: '50', value: '50'},
            { key: '100', value: '100'},
            { key: '200', value: '200'},
            { key: '500', value: '500'},
            { key: '-1', value: 'All'}
        ];
        $scope.selectedPageSizeOption = $scope.pageSizeOptions[0];
        $scope.selectedPageNumberOption = 1;
        $scope.pageNumberOptions = [];
        $scope.sortBy = 'id,desc';
        $scope.filterInfo = {
            showFilters: false,
            filterId: '',
            filterName: '',
            filterPrimaryNumber: '',
            filterSecondaryNumber: '',
            filterEmailAddress: '',
            filterUpdatedOnStart: '',
            filterUpdatedOnEnd: ''
        };
        $scope.onPageSizeChange = function () {
            $scope.selectedPageNumberOption = 1;
            $scope.fetch();
        };
        $scope.firstPage = function () {
            if($scope.selectedPageNumberOption > 1) {
                $scope.selectedPageNumberOption = 1;
                $scope.fetch();
            }
        };
        $scope.previousPage = function () {
            if($scope.selectedPageNumberOption > 1) {
                $scope.selectedPageNumberOption -= 1;
                $scope.fetch();
            }
        };
        $scope.nextPage = function () {
            if($scope.selectedPageNumberOption <= $scope.pageNumberOptions.length) {
                $scope.selectedPageNumberOption += 1;
                $scope.fetch();
            }
        };
        $scope.lastPage = function () {
            if($scope.selectedPageNumberOption < $scope.pageNumberOptions.length) {
                $scope.selectedPageNumberOption = $scope.pageNumberOptions.length;
                $scope.fetch();
            }
        };
        $scope.sort = function (sortBy) {
            $scope.selectedPageNumberOption = 1;
            var sb = $scope.sortBy.split(",");
            if(sb[0] == sortBy) {
                $scope.sortBy = sortBy + "," + (sb[1] == "asc" ? "desc" : "asc");
            } else {
                $scope.sortBy = sortBy + ",asc";
            }
            $scope.fetch();
        };
        $scope.toggleFilters = function () {
            $scope.filterInfo.showFilters = !$scope.filterInfo.showFilters;
        };
        $scope.applyFilters = function () {
            $scope.fetch();
        };
        $scope.applyFiltersOnEnter = function (event, isValid) {
            if(event.which === 13 && isValid) {
                $scope.applyFilters();
            }
        };
        $scope.applyFiltersOnChange = function (isValid) {
            if(isValid) {
                $scope.applyFilters();
            }
        };
        $scope.fetch = function () {
            $scope.contactsResponse = Contact.query({
                size: $scope.selectedPageSizeOption.key,
                page: $scope.selectedPageNumberOption - 1,
                sort: $scope.sortBy,
                fid: $scope.filterInfo.filterId,
                fn: $scope.filterInfo.filterName,
                fpn: $scope.filterInfo.filterPrimaryNumber,
                fsn: $scope.filterInfo.filterSecondaryNumber,
                fea: $scope.filterInfo.filterEmailAddress,
                fuos: $scope.filterInfo.filterUpdatedOnStart,
                fuoe:$scope.filterInfo.filterUpdatedOnEnd
            }, function(value, responseHeaders) {
                $scope.contacts = $scope.contactsResponse.content;
                $scope.pagingInfo = {
                    'last' : $scope.contactsResponse.last,
                    'totalPages' : $scope.contactsResponse.totalPages,
                    'totalElements' : $scope.contactsResponse.totalElements,
                    'size' : $scope.contactsResponse.size,
                    'number' : $scope.contactsResponse.number,
                    'sort' : $scope.contactsResponse.sort,
                    'first' : $scope.contactsResponse.first,
                    'numberOfElements' : $scope.contactsResponse.numberOfElements
                };
                $scope.pagingInfo.from = $scope.pagingInfo.number * $scope.pagingInfo.size + ($scope.pagingInfo.numberOfElements > 0? 1 : 0);
                $scope.pagingInfo.to = ($scope.pagingInfo.number + 1) * $scope.pagingInfo.size;
                if($scope.pagingInfo.to > $scope.pagingInfo.totalElements) {
                    $scope.pagingInfo.to = $scope.pagingInfo.totalElements;
                }
                $scope.pageSizeOptions.forEach(function(pageOption) {
                    if(pageOption.key == $scope.pagingInfo.size) {
                        $scope.selectedPageSizeOption = pageOption;
                    }
                });
                $scope.pageNumberOptions.length = 0;
                for(var i = 1; i <= $scope.pagingInfo.totalPages; i++) {
                    $scope.pageNumberOptions.push(i);
                }
                if($scope.pagingInfo.sort && $scope.pagingInfo.sort.length) {
                    $scope.sortBy = $scope.pagingInfo.sort[0].property + "," + ($scope.pagingInfo.sort[0].ascending ? "asc" : "desc");
                } else {
                    $scope.sortBy = 'id,asc';
                }
            }, function(httpResponse) {
                console.log("Error while querying contacts from server", httpResponse);
            }); //fetch all contacts. Issues a GET to /api/contacts
        };
        $scope.deleteContact = function(contact) { // Delete a contact. Issues a DELETE to /api/contacts/:id
            if(confirm('Are you sure you want delete this?')) {
                Contact.delete({id: contact.id}, function() {
                    $window.location.href = ''; //redirect to home
                    });
                }
            };
        $scope.fetch();
    })
    .controller('ContactViewController', function($scope, $stateParams, Contact) {
        $scope.loadContact = function() { //Issues a GET request to /api/contacts/:id to get a contact to update
            $scope.contact = Contact.get({ id: $stateParams.id });
        };
        $scope.loadContact(); // Load a contact which can be edited on UI
    })
    .controller('ContactCreateController', function($scope, $state, $stateParams, Contact) {
        $scope.contact = new Contact();  //create new contact instance. Properties will be set via ng-model on UI
        $scope.addContact = function(isValid) { //create a new contact. Issues a POST to /api/contacts
            if(isValid) {
                $scope.contact.$save(function() {
                    $state.go('contacts'); // on success go back to home i.e. contacts state.
                });
            }
        };
    })
    .controller('ContactEditController', function($scope, $state, $stateParams, Contact) {
        $scope.updateContact = function(isValid) { //Update the edited contact. Issues a PUT to /api/contacts/:id
            if(isValid) {
                $scope.contact.$update(function() {
                    $state.go('contacts'); // on success go back to home i.e. contacts state.
                });
            }
        };
        $scope.loadContact = function() { //Issues a GET request to /api/contacts/:id to get a contact to update
            $scope.contact = Contact.get({ id: $stateParams.id });
            };
        $scope.loadContact(); // Load a contact which can be edited on UI
    });
