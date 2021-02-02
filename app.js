var app = new Vue({
    el: "#app",
    data: {
        cnpj: "",
        errors: [],
        errors_digits: [],
        success: [],
        success_digits: [],
        taskExists: false,
        rectA: [[3, 5], [11, 11]],
        rectB: [[7, 2], [13, 7]],
        areaIntersects: 0,
        messageIntersects: "",
        nameTask: "",
        tasks: [
            // {name: 'Lavar louça', pending: false},
            // {name: 'Pagar conta de luz', pending: true}
        ],
        currentDateTime: null,
        loading: true,
        errored: false
    },
    watch: {
        cnpj: function (val) {
            this.clearMessages();
            if (val.length > 0) {
                if (!this.validCNPJ(val)) {
                    this.errors.push("Invalid CNPJ format");
                } else {
                    this.success.push('Format OK');
                }

                if (!this.validDigits(val)) {
                    this.errors_digits.push("Invalid CNPJ digit");
                } else {
                    this.success_digits.push('Digit OK');
                }
            } else {
                this.clearMessages();
            }
        },
        tasks: {
            deep: true,
            handler() {
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
            }
        },
    },
    methods: {
        stateClass: function (task) {
            return {
                pending: task.pending,
                'bg-primary': task.pending,
                'bg-success': !task.pending,
                done: !task.pending,
            }
        },
        // add task
        addTask: function () {
            this.taskExists = false;
            const taskNew = this.tasks.filter(task => task.name.toLowerCase() == this.nameTask.toLowerCase()).length == 0;
            if (taskNew) {
                this.tasks.push({
                    name: this.nameTask,
                    pending: true
                });
                this.nameTask = '';
                this.taskExists = false;
            } else {
                this.taskExists = true;
            }

        },

        //delete task
        removeTask: function (i) {
            this.tasks.splice(i, 1);
        },

        // task done
        toggleTask: function (i) {
            this.tasks[i].pending = !this.tasks[i].pending;
        },

        //create rectangle
        createRect: function (rect) {
            ymax = Math.max(rect[0][1], rect[1][1]);
            ymin = Math.min(rect[0][1], rect[1][1]);
            xmax = Math.max(rect[0][0], rect[1][0]);
            xmin = Math.min(rect[0][0], rect[1][0]);

            width = 0;
            height = 0;
            result = [];

            width = (xmax + 1) - xmin;
            height = (ymax + 1) - ymin;
            area = width * height;

            yinitial = ymin;
            vfinalLoop = (area + xmin);

            for (i = xmin; i < vfinalLoop; i++) {
                if (ymin == ymax + 1) {
                    xmin++;
                    ymin = yinitial;
                }
                result.push([xmin, ymin++]);
            }

            return result;
        },

        // check intersection
        intersects: function (a, b) {
            let rect1 = this.createRect(a);
            let rect2 = this.createRect(b);

            let intersection = [];
            rect1.filter(function (x) {
                rect2.filter(function (y) {

                    if (x === y) {
                        return true;
                    }
                    if (x == null || y == null) return false;
                    if (x.length !== y.length) return false;

                    for (var i = 0; i < x.length; ++i) {
                        if (x[i] !== y[i]) return false;
                    }
                    intersection.push([x]);
                    return true;


                });
            });

            if (intersection.length > 1) {
                this.messageIntersects = 'Intersetcs RectA x RectB is true';
                this.areaIntersects = intersection.length;
                return true;
            } else {
                this.messageIntersects = 'Intersetcs RectA x RectB is false';
                return false;
            }
        },
        // clear messages
        clearMessages: function () {
            this.errors = [];
            this.errors_digits = [];
            this.success = [];
            this.success_digits = [];
        },
        // validate CNPJ format only
        validCNPJ: function (cnpj) {
            var re_cnpj_formated = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
            var re_cnpj_number_only = /^\d{14}$/;
            if (re_cnpj_formated.test(cnpj) || re_cnpj_number_only.test(cnpj)) {
                return true;
            } else {
                return false;
            }

        },
        // check digits
        validDigits: function (cnpj) {
            if (cnpj.length == 0) return false;
            // clear string
            cnpj = cnpj.replace(/\D/g, '');

            // Eliminates known invalid CNPJs
            if (cnpj == "00000000000000" ||
                cnpj == "11111111111111" ||
                cnpj == "22222222222222" ||
                cnpj == "33333333333333" ||
                cnpj == "44444444444444" ||
                cnpj == "55555555555555" ||
                cnpj == "66666666666666" ||
                cnpj == "77777777777777" ||
                cnpj == "88888888888888" ||
                cnpj == "99999999999999")
                return false;

            // Check DVs
            vsize = cnpj.length - 2
            vnumber = cnpj.substring(0, vsize);
            vdigits = cnpj.substring(vsize);
            vsum = 0;
            pos = vsize - 7;
            for (i = vsize; i >= 1; i--) {
                vsum += vnumber.charAt(vsize - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            vresult = vsum % 11 < 2 ? 0 : 11 - vsum % 11;
            if (vresult != vdigits.charAt(0))
                return false;

            vsize = vsize + 1;
            vnumber = cnpj.substring(0, vsize);
            vsum = 0;
            pos = vsize - 7;
            for (i = vsize; i >= 1; i--) {
                vsum += vnumber.charAt(vsize - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            vresult = vsum % 11 < 2 ? 0 : 11 - vsum % 11;
            if (vresult != vdigits.charAt(1))
                return false;

            return true;

        },

        refreshDateTime: function () {
            axios
                .get('http://worldclockapi.com/api/json/utc/now')
                .then(response => {
                    this.currentDateTime = response.data.currentDateTime
                })
                .catch(error => {
                    console.log(error)
                    this.errored = true
                })
                .finally(() => this.loading = false)
        },
        format_date: function (value) {
            if (value) {
                return moment(String(value)).format('DD/MM/YYYY HH:mm', "America/Brasilia");
            }
        },
    },
    created() {
        const json = localStorage.getItem('tasks');
        const array = JSON.parse(json);
        this.tasks = Array.isArray(array) ? array : [];

        axios
            .get('http://worldclockapi.com/api/json/utc/now')
            .then(response => {
                this.currentDateTime = response.data.currentDateTime
            })
            .catch(error => {
                console.log(error)
                this.errored = true
            })
            .finally(() => this.loading = false)

    },
});