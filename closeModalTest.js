    test('closeModal hides modal and restores focus', () => {
        const previousActiveElement = { focus: jest.fn() };
        global.document.activeElement = previousActiveElement;

        openUni(unis[0].id);
        expect(getLastFocusedElement()).toBe(previousActiveElement);

        closeModal();
        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(true);
        expect(previousActiveElement.focus).toHaveBeenCalled();
        expect(getLastFocusedElement()).toBe(null);
    });
