/// <reference types="Cypress" />

    describe('Central de Atendimento ao Cliente TAT', function(){
        const THREE_SECONDS_IN_MS = 3000

        beforeEach(function(){
            cy.visit('./src/index.html')
        })
        it('verifica o título da aplicação', function(){
            cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
        })
        /// Funcionalidade only = serve para executar apenas esse teste abaixo: 
        it('preenche os campos obrigatórios e envia ao formulário', function() {
            
            const longText = 'teste, teste, teste, teste, teste, teste, teste, teste ...'
            cy.clock()

            cy.get('#firstName').type('Vinicius')
            cy.get('#lastName').type('Sousa')
            cy.get('#email').type('test@gmail.com')
            // QUANTO TIVER "#open..." significa que a # é a definição de um id
            cy.get('#open-text-area').type(longText, { delay: 0}) // EXERCICIO EXTRA 2!
          //cy.get('button[type="submit"]').click()
            cy.contains('button', 'Enviar').click()
           
            //  QUANDO TIVER ".sucesss" significa que o ponto é a definição para uma class
            cy.get('.success').should('be.visible')

            cy.tick(THREE_SECONDS_IN_MS)

            cy.get('.success').should('not.be.visible')

        })

        // Exercicio extra 3
        it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
            cy.clock()
            cy.get('#firstName').type('Vinicius')
            cy.get('#lastName').type('Sousa')
            cy.get('#email').type('test.gmail')
            cy.get('#open-text-area').type('error')
            cy.get('button[type="submit"]').click()

            cy.get('.error').should('be.visible')

            cy.tick(THREE_SECONDS_IN_MS)
            cy.get('.error').should('not.be.visible')

        })
        ///Exercicio 03
        it('campo telefone continua vazio quando preenchido com valor não-numérico', function(){
            cy.get('#phone')
            .type('abcd') // tenta digitar no campo uma string onde não é permitido
            .should('have.value', '') // Já que o campo telefone só aceita números, fazemos uma verificação para ver se ele está vazio
        })
        ///Exercicio 04
        it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
            cy.clock()
            cy.get('#firstName').type('Vinicius')
            cy.get('#lastName').type('Sousa')
            cy.get('#email').type('teste@cypress.com')
            cy.get('#phone-checkbox').click() //Clicando no checkbox
            cy.get('#open-text-area').type('abc')
            cy.get('button[type="submit"]').click()

            cy.get('.error').should('be.visible')
            cy.tick(THREE_SECONDS_IN_MS)

            cy.get('.error').should('not.be.visible')
        })
        ///Exercicio 05
        it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
            cy.get('#firstName').type('Vinicius').should('have.value', 'Vinicius').clear().should('have.value', '')
            cy.get('#lastName').type('Sousa').should('have.value', 'Sousa').clear().should('have.value', '')
            cy.get('#email').type('teste@cypress.com').should('have.value','teste@cypress.com').clear().should('have.value', '')
            cy.get('#phone').type('9983247').should('have.value','9983247').clear().should('have.value', '')

        })
        ///Exercicio 06
        it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
            cy.clock()
            cy.get('button[type="submit"]').click()
            cy.get('.error').should('be.visible')
            cy.tick(THREE_SECONDS_IN_MS)

            cy.get('.error').should('not.be.visible')
        })
        ///Exercicio 07
        it('envia o formuário com sucesso usando um comando customizado', function(){
            cy.clock()
            cy.fillMandatoryFieldsAndSubmit() //preenche os campos e clica em submit

            cy.get('.success').should('be.visible')
            cy.tick(THREE_SECONDS_IN_MS)
            cy.get('.success').should('not.be.visible')
        })

        it('seleciona um produto (YouTube) por seu texto', function(){
            cy.get('#product').select('YouTube').should('have.value', 'youtube')
        })

        it('seleciona um produto (Mentoria) por seu valor (value)', function(){
            cy.get('#product').select('mentoria').should('have.value', 'mentoria')
        })

        it('seleciona um produto (Blog) por seu índice', function(){
            cy.get('#product').select(1).should('have.value', 'blog')
        })

        it('marca o tipo de atendimento "Feedback"', function(){
            cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback')
        })

        it('marca cada tipo de atendimento', function(){
            cy.get('input[type="radio"').should('have.length', 3)
                .each(function($radio){
                    cy.wrap($radio).check() // wrap = empacota elementos para que possamos usar funcoes do cypress
                    cy.wrap($radio).should('be.checked')
            })
        })

        it('marca ambos checkboxes, depois desmarca o último', function(){
            cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last() // desmarca o ultimo, da um "uncheck" e faz a validação
            .uncheck().should('not.be.checked')
        
        })

        it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
            cy.clock()
            cy.get('#firstName').type('Vinicius')
            cy.get('#lastName').type('Sousa')
            cy.get('#email').type('teste@cypress.com')
            cy.get('#phone-checkbox').check().should('be.checked') //Clicando no checkbox
            cy.get('#open-text-area').type('abc')
            cy.get('button[type="submit"]').click()

            cy.get('.error').should('be.visible')
            cy.tick(THREE_SECONDS_IN_MS)
            cy.get('.error').should('not.be.visible')
        })

        it('seleciona um arquivo da pasta fixtures', function(){
            cy.get('input[type="file"]').should('not.have.value') //Video 29 do curso
            .selectFile('cypress/fixtures/example.json').should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
        
        })

        it('seleciona um arquivo simulando um drag-and-drop', function(){
            cy.get('input[type="file"]').should('not.have.value') //Video 30 do curso
            .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'}) // drag drop é a simulação de como se o usuario estivesse arrastando o arquivo para o campo;
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
             })

        })

        it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
            cy.fixture('example.json').as('sampleFile') // as = altera o nome e utiliza no selectFile
            cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
             })
        })

        it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
            cy.get('#privacy a').should('have.attr', 'target', '_blank') // attr = atributo
        })

        it('acessa a página da política de privacidade removendo o target e então clicando no link',function(){
            cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()

            cy.contains('Talking About Testing').should('be.visible')
        })

        Cypress._.times(5, function() { /// faz com que o teste rode 5 vezes provando ser estavel
            it('exibe a mensagem por 3 segundos', function(){
                cy.clock() //Congela o relogio do navegador
                cy.get('button[type="submit"]').click()
    
                cy.get('.error').should('be.visible')
    
                cy.tick(THREE_SECONDS_IN_MS)/// avança o tempo
    
                cy.get('.error').should('not.be.visible')
                
            })
        })
        // aula 50
        it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function(){
            cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
          cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
        })
        it('preenche a area de texto usando o comando invoke', function(){
            const longText = Cypress._.repeat('0123456789', 20) // invoca o valor de 200 caracteres
            cy.get('#open-text-area').invoke('val', longText)
            .should('have.value', longText)

        })
        ///AULA 54
        it('Faz um requisição http', function(){
            cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
                .should(function(response){
                    const { status, statusText, body} = response // desestruturação do objeto 'response'
                    expect(status).to.equal(200)
                    expect(statusText).to.equal('OK')
                    expect(body).to.include('CAC TAT')
                })
        })
        it.only('Em busca do Gato', function(){
            // Minha resolução foi essa abaixo: 
           /*cy.get('#cat').should('not.be.visible')
               .invoke('show').should('be.visible').and('contain', '🐈') */
            //Resolução do professor: 
            cy.get('#cat').invoke('show').should('be.visible')
            cy.get('#title').invoke('text', 'CAT TAT')
            cy.get('#subtitle').invoke('text', 'Eu <3 gatos')
        })
    })

