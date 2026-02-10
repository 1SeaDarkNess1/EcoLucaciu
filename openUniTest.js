    test('openUni should show modal with correct info and manage focus', () => {
        const uni = unis[0];
        const previousActiveElement = { focus: jest.fn() };
        global.document.activeElement = previousActiveElement;

        openUni(uni.id);

        expect(mockElements['uni-modal'].classes.has('hidden')).toBe(false);
        expect(mockElements['modal-body'].innerHTML).toContain(uni.n);
        expect(mockElements['modal-body'].innerHTML).toContain(uni.m);
        expect(mockElements['modal-body'].innerHTML).toContain('Medie:');
        expect(mockElements['modal-body'].innerHTML).toContain(uni.d);
        expect(mockElements['modal-close-btn'].focus).toHaveBeenCalled();
        expect(getLastFocusedElement()).toBe(previousActiveElement);

        // Verify structure
        expect(mockElements['modal-body'].innerHTML).toContain('<h1');
        expect(mockElements['modal-body'].innerHTML).toContain('<b');
        expect(mockElements['modal-body'].innerHTML).toContain('<hr');
        expect(mockElements['modal-body'].innerHTML).toContain('<div');
    });
