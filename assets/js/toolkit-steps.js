var stepData = {
    roleType: '',
    step1Value: '',
    step2Value: '',
    currentStep: 1,
    sliderValue: 0,
    infoStepShown: false  // Track if info step has been shown
};

function initToolkitModal() {
    // Open modal
    $('#exploreBtn').on('click', function() {
        var selected = document.querySelector('input[name="role_type"]:checked');

        if (!selected) {
            alert('Please select a role first');
            return;
        }

        stepData.roleType = selected.value;
        stepData.currentStep = 1;
        stepData.step1Value = '';
        stepData.step2Value = '';
        stepData.sliderValue = 0;
        stepData.infoStepShown = false;

        var partialPath = '';
        if (stepData.roleType === 'researcher') {
            partialPath = 'steps/researcher/step1';
        } else if (stepData.roleType === 'practitioner') {
            partialPath = 'steps/practitioner/step1';
        } else {
            alert('Please select Researcher or Practitioner role');
            return;
        }

        $.request('onOpenModal', {
            data: {
                role_type: stepData.roleType,
                partial: partialPath
            },
            success: function(data) {
                $('#modalContent').html(data['#modalContent']);
                updateStepIndicator(1);
                updateModalTitle();
                $('#ExploreToolkit').modal('show');

                // Initialize slider if practitioner
                if (stepData.roleType === 'practitioner') {
                    initSlider();
                }
            }
        });
    });

    // Next step
    $(document).on('click', '#btnNext', function() {
        var currentStep = stepData.currentStep;
        var roleType = stepData.roleType;
        var basePath = 'steps/' + roleType + '/';

        if (roleType === 'researcher') {
            if (currentStep === 1 && !stepData.infoStepShown) {
                // Step 1: Save selection, then show info step (step1b)
                var selected = document.querySelector('input[name="step1"]:checked');
                if (!selected) {
                    alert('Please select an option');
                    return;
                }
                stepData.step1Value = selected.value;
                stepData.infoStepShown = true;

                // Load info step but DON'T update step indicator
                loadStep(basePath + 'step1b', null);

            } else if (stepData.infoStepShown && currentStep === 1) {
                // Coming from info step, go to step 2
                stepData.currentStep = 2;
                loadStep(basePath + 'step2', 2);

            } else if (currentStep === 2) {
                // Step 2: Selection
                var selected = document.querySelector('input[name="step2"]:checked');
                if (!selected) {
                    alert('Please select an option');
                    return;
                }
                stepData.step2Value = selected.value;
                stepData.currentStep = 3;
                loadStep(basePath + 'step3', 3);
            }

        } else if (roleType === 'practitioner') {
            if (currentStep === 1 && !stepData.infoStepShown) {
                // Step 1: Save slider value, then show info step (step1b)
                var slider = document.getElementById('scaleSlider');
                stepData.sliderValue = parseInt(slider.value);
                stepData.step1Value = stepData.sliderValue <= 50 ? 'local' : 'national';
                stepData.infoStepShown = true;

                // Load info step but DON'T update step indicator
                loadStep(basePath + 'step1b', null);

            } else if (stepData.infoStepShown && currentStep === 1) {
                // Coming from info step, go to step 2
                stepData.currentStep = 2;
                loadStep(basePath + 'step2', 2);

            } else if (currentStep === 2) {
                // Step 2: Enablers/Constraints selection
                var selected = document.querySelector('input[name="step2"]:checked');
                if (!selected) {
                    alert('Please select an option');
                    return;
                }
                stepData.step2Value = selected.value;
                stepData.currentStep = 3;
                loadStep(basePath + 'step3', 3);
            }
        }
    });

    // Back step
    $(document).on('click', '#btnBack', function() {
        var roleType = stepData.roleType;
        var basePath = 'steps/' + roleType + '/';

        if (stepData.infoStepShown && stepData.currentStep === 1) {
            // On info step, go back to step 1
            stepData.infoStepShown = false;
            loadStep(basePath + 'step1', 1, function() {
                // Re-initialize slider if practitioner
                if (roleType === 'practitioner') {
                    setTimeout(function() {
                        initSlider();
                        var slider = document.getElementById('scaleSlider');
                        if (slider) {
                            slider.value = stepData.sliderValue;
                            updateSliderBackground(stepData.sliderValue);
                            updateScaleLabel(stepData.sliderValue);
                        }
                    }, 100);
                }
            });

        } else if (stepData.currentStep === 2) {
            // On step 2, go back to info step
            stepData.currentStep = 1;
            stepData.infoStepShown = true;
            loadStep(basePath + 'step1b', null);

        } else if (stepData.currentStep === 3) {
            // On step 3, go back to step 2
            stepData.currentStep = 2;
            loadStep(basePath + 'step2', 2);
        }
    });

    // View Tool (Final step)
    $(document).on('click', '#btnViewTool, .view-tool-link', function(e) {
        e.preventDefault();
        var url = '/toolkit/tool/' + stepData.roleType + '/' + stepData.step1Value + '/' + stepData.step2Value;
        window.location.href = url;
    });

    // Handle radio selection expand in practitioner step 2
    $(document).on('change', '.expandable-options input[type="radio"]', function() {
        $('.option-details').slideUp(200);
        $(this).closest('.form-check').find('.option-details').slideDown(200);
    });
}

function loadStep(partialPath, indicatorStep, callback) {
    $.request('onLoadStep', {
        data: {
            step: stepData.currentStep,
            role_type: stepData.roleType,
            step1_value: stepData.step1Value,
            step2_value: stepData.step2Value,
            slider_value: stepData.sliderValue,
            partial: partialPath
        },
        success: function(data) {
            $('#modalContent').html(data['#modalContent']);

            // Only update indicator if indicatorStep is provided
            if (indicatorStep !== null) {
                updateStepIndicator(indicatorStep);
            }

            if (typeof callback === 'function') {
                callback();
            }
        }
    });
}

function initSlider() {
    var slider = document.getElementById('scaleSlider');
    if (!slider) return;

    slider.addEventListener('input', function() {
        updateSliderBackground(this.value);
        updateScaleLabel(this.value);
    });

    // Initial state
    updateSliderBackground(slider.value);
    updateScaleLabel(slider.value);
}

function updateSliderBackground(value) {
    var slider = document.getElementById('scaleSlider');
    if (!slider) return;
    slider.style.background = 'linear-gradient(90deg, #FE8181 0%, #F8CE80 53.76%, #89ED85 100%)';
}

function updateScaleLabel(value) {
    var label = document.getElementById('scaleLabel');
    if (!label) return;

    if (value <= 33) {
        label.textContent = 'Local';
        label.className = 'scale-label local';
    } else if (value <= 66) {
        label.textContent = 'Regional';
        label.className = 'scale-label regional';
    } else {
        label.textContent = 'National';
        label.className = 'scale-label national';
    }
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

function updateModalTitle() {
    var title = '';
    if (stepData.roleType === 'researcher') {
        title = 'Researcher Toolkit';
    } else if (stepData.roleType === 'practitioner') {
        title = 'Practitioner Toolkit';
    } else {
        title = 'Toolkit';
    }
    $('#modalTitle').text(title);
}

// Initialize on DOM ready
$(document).ready(function() {
    initToolkitModal();
});
