var stepData = {
    roleType: '',
    step1Value: '',
    step2Value: '',
    step3Value: '',
    currentStep: 1,
    infoStepShown: false
};

function initToolkitModal() {
    // Open modal
    $('#exploreBtn').on('click', function() {
        var selected = document.querySelector('input[name="role_type"]:checked');

        if (!selected) {
            alert('Please select a role first');
            return;
        }

        // Reset all data
        stepData.roleType = selected.value;
        stepData.currentStep = 1;
        stepData.step1Value = '';
        stepData.step2Value = '';
        stepData.step3Value = '';
        stepData.infoStepShown = false;

        var partialPath = 'steps/' + stepData.roleType + '/step1';

        $.request('onOpenModal', {
            data: {
                role_type: stepData.roleType,
                partial: partialPath
            },
            success: function(data) {
                $('#modalContent').html(data['#modalContent']);
                updateStepIndicator(1);
                $('#ExploreToolkit').modal('show');
            },
            error: function(xhr) {
                console.error('Error:', xhr);
            }
        });
    });

    // Next step
    $(document).on('click', '#btnNext', function() {
        var currentStep = stepData.currentStep;
        var roleType = stepData.roleType;
        var basePath = 'steps/' + roleType + '/';
        var selected;
        var inputName = roleType === 'researcher' ? 'step1' : 'scale';

        if (currentStep === 1 && !stepData.infoStepShown) {
            // Step 1 -> Step 1b
            selected = document.querySelector('input[name="' + inputName + '"]:checked');
            if (!selected) {
                alert('Please select an option');
                return;
            }
            stepData.step1Value = selected.value;
            stepData.infoStepShown = true;
            loadStep(basePath + 'step1b', null);

        } else if (stepData.infoStepShown && currentStep === 1) {
            // Step 1b -> Step 2
            stepData.currentStep = 2;
            loadStep(basePath + 'step2', 2);

        } else if (currentStep === 2) {
            // Step 2 -> Step 3
            selected = document.querySelector('input[name="step2"]:checked');
            if (!selected) {
                alert('Please select an option');
                return;
            }
            stepData.step2Value = selected.value;
            stepData.currentStep = 3;
            loadStep(basePath + 'step3', 3);
        }
    });

    // View Tool button (on step 3)
    $(document).on('click', '#btnViewTool', function(e) {
        e.preventDefault();
        var selected = document.querySelector('input[name="step3"]:checked');
        if (!selected) {
            alert('Please select a tool');
            return;
        }
        stepData.step3Value = selected.value;
        var url = '/toolkit/tool/' + stepData.roleType + '/' + stepData.step1Value + '/' + stepData.step2Value + '/' + stepData.step3Value;
        window.location.href = url;
    });

    // Direct view tool link click
    $(document).on('click', '.view-tool-link', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var url = $(this).attr('href');
        window.location.href = url;
    });

    // Back step
    $(document).on('click', '#btnBack', function() {
        var roleType = stepData.roleType;
        var basePath = 'steps/' + roleType + '/';
        var inputName = roleType === 'researcher' ? 'step1' : 'scale';

        if (stepData.infoStepShown && stepData.currentStep === 1) {
            // Step 1b -> Step 1
            stepData.infoStepShown = false;
            loadStep(basePath + 'step1', 1, function() {
                // Re-select previous option
                setTimeout(function() {
                    var radio = document.querySelector('input[name="' + inputName + '"][value="' + stepData.step1Value + '"]');
                    if (radio) {
                        radio.checked = true;
                    }
                }, 100);
            });

        } else if (stepData.currentStep === 2) {
            // Step 2 -> Step 1b
            stepData.currentStep = 1;
            stepData.infoStepShown = true;
            loadStep(basePath + 'step1b', null);

        } else if (stepData.currentStep === 3) {
            // Step 3 -> Step 2
            stepData.currentStep = 2;
            loadStep(basePath + 'step2', 2, function() {
                // Re-select previous option
                setTimeout(function() {
                    var radio = document.querySelector('input[name="step2"][value="' + stepData.step2Value + '"]');
                    if (radio) {
                        radio.checked = true;
                    }
                }, 100);
            });
        }
    });

    // Reset modal when closed
    $('#ExploreToolkit').on('hidden.bs.modal', function() {
        stepData.roleType = '';
        stepData.step1Value = '';
        stepData.step2Value = '';
        stepData.step3Value = '';
        stepData.currentStep = 1;
        stepData.infoStepShown = false;
        $('#modalContent').html('');
    });
}

function loadStep(partialPath, indicatorStep, callback) {
    $.request('onLoadStep', {
        data: {
            role_type: stepData.roleType,
            step1_value: stepData.step1Value,
            step2_value: stepData.step2Value,
            partial: partialPath
        },
        success: function(data) {
            $('#modalContent').html(data['#modalContent']);

            if (indicatorStep !== null) {
                updateStepIndicator(indicatorStep);
            }

            if (typeof callback === 'function') {
                callback();
            }
        },
        error: function(xhr) {
            console.error('loadStep error:', xhr);
        }
    });
}

function updateStepIndicator(step) {
    $('.step-dot').each(function(index) {
        $(this).removeClass('active completed');
        if (index + 1 < step) {
            $(this).addClass('completed');
        } else if (index + 1 === step) {
            $(this).addClass('active');
        }
    });
}

$(document).ready(function() {
    initToolkitModal();
});

// Action Steps Modal - Open on "Read more" click
$(document).on('click', '.step-readmore', function(e) {
    e.preventDefault();
    var targetModal = $(this).data('target');
    $(targetModal).modal('show');
});

