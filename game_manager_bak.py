import sys
import os
import re
from pathlib import Path
from collections import Counter

from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QListWidget, QListWidgetItem, QPushButton, QMessageBox,
    QFrame, QScrollArea, QLineEdit, QRadioButton, QButtonGroup, QSpinBox,
    QCheckBox, QPlainTextEdit
)
from PySide6.QtCore import Qt


class ModernLineEdit(QLineEdit):
    def __init__(self):
        super().__init__()
        self.setStyleSheet("""
            QLineEdit {
                background-color: #2d2d2d;
                border: 1px solid #404040;
                border-radius: 4px;
                padding: 6px 8px;
                color: #ffffff;
                font-size: 11px;
            }
            QLineEdit:focus {
                border: 1px solid #0078d7;
            }
        """)


class ModernSpinBox(QSpinBox):
    def __init__(self):
        super().__init__()
        self.setStyleSheet("""
            QSpinBox {
                background-color: #2d2d2d;
                border: 1px solid #404040;
                border-radius: 4px;
                padding: 4px 8px;
                color: #ffffff;
                font-size: 11px;
            }
            QSpinBox:focus {
                border: 1px solid #0078d7;
            }
            QSpinBox::up-button, QSpinBox::down-button {
                background-color: #3a3a3a;
                border: none;
                width: 16px;
            }
            QSpinBox::up-button:hover, QSpinBox::down-button:hover {
                background-color: #4a4a4a;
            }
        """)


class ModernButton(QPushButton):
    def __init__(self, text: str, style_type: str = "primary"):
        super().__init__(text)
        self.style_type = style_type
        self.setCursor(Qt.PointingHandCursor)
        self.update_style()

    def update_style(self):
        colors = {
            "primary": {"bg": "#0078d7", "hover": "#005a9e"},
            "success": {"bg": "#4ed95b", "hover": "#3ec44b"},
            "danger": {"bg": "#d32f2f", "hover": "#b71c1c"},
            "secondary": {"bg": "#4a4a4a", "hover": "#5a5a5a"},
            "info": {"bg": "#17a2b8", "hover": "#138496"},
        }
        c = colors.get(self.style_type, colors["primary"])
        self.setStyleSheet(f"""
            QPushButton {{
                background-color: {c['bg']};
                color: white;
                border: none;
                border-radius: 4px;
                padding: 7px 14px;
                font-size: 11px;
                font-weight: bold;
                min-height: 28px;
            }}
            QPushButton:hover {{
                background-color: {c['hover']};
            }}
            QPushButton:pressed {{
                background-color: {c['bg']};
                padding-top: 8px;
            }}
            QPushButton:disabled {{
                background-color: #3a3a3a;
                color: #666666;
            }}
        """)


class GameManagerApp(QMainWindow):
    @staticmethod
    def js_escape(value: str) -> str:
        if value is None:
            return ""
        s = str(value)
        # Orden importante: primero backslash, luego comillas.
        s = s.replace("\\", "\\\\")
        s = s.replace("'", "\\'")
        s = s.replace("\r", "\\r").replace("\n", "\\n").replace("\t", "\\t")
        return s

    @staticmethod
    def js_unescape(value: str) -> str:
        """Revierte escapes comunes de strings JS (\\', \\\\, \\n, \\r, \\t)."""
        if value is None:
            return ""
        s = str(value)
        out = []
        i = 0
        while i < len(s):
            ch = s[i]
            if ch != "\\":
                out.append(ch)
                i += 1
                continue
            if i + 1 >= len(s):
                break
            nxt = s[i + 1]
            if nxt in ("\\", "'", '"'):
                out.append(nxt)
            elif nxt == "n":
                out.append("\n")
            elif nxt == "r":
                out.append("\r")
            elif nxt == "t":
                out.append("\t")
            else:
                out.append(nxt)
            i += 2
        return "".join(out)

    def __init__(self):
        super().__init__()
        self.setWindowTitle("Gestor de Juegos")
        self.setGeometry(100, 100, 950, 700)

        self.setStyleSheet("""
            QMainWindow { background-color: #1e1e1e; }
            QScrollArea { border: none; }
            QRadioButton { color: #ffffff; font-size: 11px; }
            QRadioButton::indicator { width: 14px; height: 14px; }
        """)

        self.html_file = None
        self.js_file = None
        self.find_files()

        self.games = []
        self.selected_game = None

        if not self.html_file or not self.js_file:
            self.show_file_not_found()
        else:
            self.load_games()
            self.create_widgets()

    def find_files(self):
        current_dir = Path.cwd()

        html_candidates = list(current_dir.glob("gallery-index.html"))
        js_candidates = list(current_dir.glob("index.js"))

        if not html_candidates:
            html_candidates = list(current_dir.glob("*/gallery-index.html"))
        if not html_candidates:
            html_candidates = list(current_dir.glob("*/*/gallery-index.html"))

        if not js_candidates:
            js_candidates = list(current_dir.glob("*/index.js"))
        if not js_candidates:
            js_candidates = list(current_dir.glob("*/*/index.js"))

        self.html_file = str(html_candidates[0]) if html_candidates else None
        self.js_file = str(js_candidates[0]) if js_candidates else None

        if self.html_file and self.js_file:
            html_dir = Path(self.html_file).parent
            js_in_same_dir = html_dir / "index.js"
            if js_in_same_dir.exists():
                self.js_file = str(js_in_same_dir)

    def show_file_not_found(self):
        central = QWidget()
        self.setCentralWidget(central)
        layout = QVBoxLayout(central)
        layout.setAlignment(Qt.AlignCenter)

        label = QLabel("âš ï¸ Archivos no encontrados")
        label.setStyleSheet("color: #ff5555; font-size: 16px; font-weight: bold;")
        layout.addWidget(label)

        msg = "No se encontraron los archivos:\n\n"
        if not self.html_file:
            msg += "â€¢ gallery-index.html\n"
        if not self.js_file:
            msg += "â€¢ index.js\n"

        info = QLabel(msg)
        info.setStyleSheet("color: #ffffff; font-size: 11px;")
        layout.addWidget(info)

    def load_games(self):
        self.games = []
        try:
            with open(self.html_file, "r", encoding="utf-8") as f:
                html_content = f.read()
            with open(self.js_file, "r", encoding="utf-8") as f:
                js_content = f.read()

            # HTML
            pattern = r'<a[^>]*data-game-id=\"([^\"]+)\"[^>]*class=\"game-item\"[^>]*>\s*<img[^>]*src=\"([^\"]+)\"[^>]*>\s*<p>([^<]+)</p>'
            html_matches = re.findall(pattern, html_content, re.DOTALL)
            if not html_matches:
                pattern = r'<a[^>]*class=\"game-item\"[^>]*data-game-id=\"([^\"]+)\"[^>]*>\s*<img[^>]*src=\"([^\"]+)\"[^>]*>\s*<p>([^<]+)</p>'
                html_matches = re.findall(pattern, html_content, re.DOTALL)

            # JS
            download_data = self._parse_game_download_links_data(js_content)

            for game_id, img_src, name in html_matches:
                self.games.append({
                    "id": game_id,
                    "name": name,
                    "img": img_src,
                    "downloads": download_data.get(game_id, []),
                })

            self.games.sort(key=lambda x: x["name"].lower())

        except Exception as e:
            QMessageBox.critical(self, "Error", f"Error al cargar los archivos:\n{str(e)}")

    # -------------------- UI --------------------

    def create_widgets(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        main_layout = QHBoxLayout(central_widget)
        main_layout.setContentsMargins(10, 10, 10, 10)
        main_layout.setSpacing(10)

        # Panel izquierdo
        left_panel = QFrame()
        left_panel.setStyleSheet("QFrame { background-color: #252526; border-radius: 6px; }")
        left_panel.setFixedWidth(280)

        left_layout = QVBoxLayout(left_panel)
        left_layout.setContentsMargins(10, 10, 10, 10)
        left_layout.setSpacing(8)

        info_text = f"{os.path.basename(self.html_file)} | {os.path.basename(self.js_file)}"
        file_info = QLabel(info_text)
        file_info.setStyleSheet("QLabel { color: #666666; font-size: 9px; padding: 2px; background-color: #1e1e1e; border-radius: 3px; }")
        file_info.setAlignment(Qt.AlignCenter)
        left_layout.addWidget(file_info)

        self.title_label = QLabel(f"Juegos ({len(self.games)})")
        self.title_label.setStyleSheet("QLabel { color: #ffffff; font-size: 13px; font-weight: bold; }")
        self.title_label.setAlignment(Qt.AlignCenter)
        left_layout.addWidget(self.title_label)

        self.game_listbox = QListWidget()
        self.game_listbox.setStyleSheet("""
            QListWidget {
                background-color: #1e1e1e;
                border: 1px solid #3a3a3a;
                border-radius: 4px;
                padding: 4px;
            }
            QListWidget::item {
                color: #ffffff;
                padding: 6px 10px;
                border-radius: 3px;
                font-size: 11px;
            }
            QListWidget::item:hover { background-color: #3a3a3a; }
            QListWidget::item:selected { background-color: #0078d7; }
        """)
        self.game_listbox.itemSelectionChanged.connect(self.on_game_select)
        left_layout.addWidget(self.game_listbox)

        action_buttons = QHBoxLayout()
        action_buttons.setSpacing(5)

        self.btn_edit = ModernButton("Editar", "primary")
        self.btn_edit.setEnabled(False)
        self.btn_edit.clicked.connect(self.edit_game)
        action_buttons.addWidget(self.btn_edit)

        self.btn_delete = ModernButton("Eliminar", "danger")
        self.btn_delete.setEnabled(False)
        self.btn_delete.clicked.connect(self.delete_game)
        action_buttons.addWidget(self.btn_delete)

        left_layout.addLayout(action_buttons)

        self.btn_add = ModernButton("Añadir", "success")
        self.btn_add.clicked.connect(self.add_game)
        left_layout.addWidget(self.btn_add)

        main_layout.addWidget(left_panel)

        # Panel derecho
        self.right_panel = QFrame()
        self.right_panel.setObjectName("rightPanel")
        self.right_panel.setStyleSheet("QFrame#rightPanel { background-color: #252526; border-radius: 6px; }")

        self.right_layout = QVBoxLayout(self.right_panel)
        self.right_layout.setContentsMargins(0, 0, 0, 0)

        self.show_placeholder()

        main_layout.addWidget(self.right_panel, 1)

        self.refresh_game_list()

    def show_placeholder(self):
        self.clear_right_panel()
        placeholder = QWidget()
        placeholder_layout = QVBoxLayout(placeholder)
        placeholder_layout.setAlignment(Qt.AlignCenter)

        text = QLabel("Selecciona un juego o añade uno nuevo")
        text.setStyleSheet("QLabel { color: #666666; font-size: 12px; }")
        text.setAlignment(Qt.AlignCenter)
        placeholder_layout.addWidget(text)

        self.right_layout.addWidget(placeholder)

    def clear_right_panel(self):
        while self.right_layout.count():
            item = self.right_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

    def refresh_game_list(self):
        # Evitar señales durante el refresh
        try:
            self.game_listbox.itemSelectionChanged.disconnect(self.on_game_select)
        except Exception:
            pass

        self.game_listbox.clear()
        for game in self.games:
            self.game_listbox.addItem(QListWidgetItem(game["name"]))

        self.game_listbox.itemSelectionChanged.connect(self.on_game_select)

    def on_game_select(self):
        selection = self.game_listbox.selectedItems()
        if selection:
            index = self.game_listbox.row(selection[0])
            if 0 <= index < len(self.games):
                self.selected_game = self.games[index]
                self.btn_edit.setEnabled(True)
                self.btn_delete.setEnabled(True)
                return

        self.selected_game = None
        self.btn_edit.setEnabled(False)
        self.btn_delete.setEnabled(False)

    def add_game(self):
        self.show_editor(mode="add")

    def edit_game(self):
        if self.selected_game:
            self.show_editor(mode="edit", game=self.selected_game)

    def delete_game(self):
        if not self.selected_game:
            return
        reply = QMessageBox.question(
            self,
            "Confirmar",
            f"Â¿Eliminar '{self.selected_game['name']}'?",
            QMessageBox.Yes | QMessageBox.No,
        )
        if reply != QMessageBox.Yes:
            return

        success = self.delete_game_from_files(self.selected_game)
        if success:
            self.games.remove(self.selected_game)
            self.selected_game = None
            self.btn_edit.setEnabled(False)
            self.btn_delete.setEnabled(False)
            self.games.sort(key=lambda x: x["name"].lower())
            self.refresh_game_list()
            self.update_game_count()
            self.show_placeholder()

    def update_game_count(self):
        self.title_label.setText(f"Juegos ({len(self.games)})")

    # -------------------- Editor --------------------


    def show_editor(self, mode: str = "add", game=None):
        self.clear_right_panel()

        self.fields = {}
        self.single_link_entries = []

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)

        container = QWidget()
        container.setStyleSheet("QWidget { background-color: #252526; }")

        form_layout = QVBoxLayout(container)
        form_layout.setContentsMargins(15, 15, 15, 15)
        form_layout.setSpacing(10)

        title_text = "Editar datos" if mode == "edit" else "Añadir juego"
        title = QLabel(title_text)
        title.setStyleSheet("QLabel { color: #ffffff; font-size: 14px; font-weight: bold; }")
        title.setAlignment(Qt.AlignCenter)
        form_layout.addWidget(title)

        self.create_field(form_layout, "Nombre", "name", game["name"] if game else "")
        self.create_field(form_layout, "ID", "id", game["id"] if game else "")
        
        self.id_warning_label = QLabel("")
        self.id_warning_label.setStyleSheet("QLabel { color: #ff5555; font-size: 10px; margin-top: 2px; margin-bottom: 5px; }")
        self.id_warning_label.setWordWrap(True)
        self.id_warning_label.hide()
        form_layout.addWidget(self.id_warning_label)
        
        self.editing_game_id = game["id"] if mode == "edit" and game else None
        self.fields["id"].textChanged.connect(self.check_id_exists)
        
        self.create_field(form_layout, "URL Portada", "img", game["img"] if game else "")

        sep = QFrame()
        sep.setFrameShape(QFrame.HLine)
        sep.setStyleSheet("background-color: #404040; max-height: 1px;")
        form_layout.addWidget(sep)

        dl_label = QLabel("Descargas")
        dl_label.setStyleSheet("QLabel { color: #cccccc; font-size: 11px; font-weight: bold; }")
        form_layout.addWidget(dl_label)

        type_container = QWidget()
        type_layout = QHBoxLayout(type_container)
        type_layout.setContentsMargins(0, 0, 0, 0)
        type_layout.setSpacing(15)

        self.check_single = QCheckBox("Link ünico / Actualizaciones")
        self.check_parts = QCheckBox("Múltiples partes")
        self.check_single.setStyleSheet("color: white;")
        self.check_parts.setStyleSheet("color: white;")
        
        type_layout.addWidget(self.check_parts)
        type_layout.addWidget(self.check_single)
        type_layout.addStretch()
        form_layout.addWidget(type_container)
        
        # Agrupamos los frames en un widget para controlar orden visual si fuera necesario, 
        # pero QVBoxLayout estÃ¡ bien. Pondremos PARTES primero, luego SINGLE links.

        # ---- Múltiples partes ----
        self.parts_frame = QFrame()
        self.parts_frame.setStyleSheet("QFrame { background-color: #1e1e1e; border-radius: 4px; padding: 8px; margin-top: 5px; }")
        self.parts_frame.hide()

        parts_layout = QVBoxLayout(self.parts_frame)
        parts_layout.setContentsMargins(8, 8, 8, 8)
        parts_layout.setSpacing(8)

        self.create_field(parts_layout, "Texto principal (Partes)", "parts_main_text", "")

        parts_control = QWidget()
        parts_control_layout = QHBoxLayout(parts_control)
        parts_control_layout.setContentsMargins(0, 0, 0, 0)
        parts_control_layout.setSpacing(8)

        label = QLabel("Cantidad partes:")
        label.setStyleSheet("color: #cccccc; font-size: 11px;")
        parts_control_layout.addWidget(label)

        self.parts_spinbox = ModernSpinBox()
        self.parts_spinbox.setRange(2, 20)
        self.parts_spinbox.setValue(2)
        self.parts_spinbox.setFixedWidth(60)
        self.parts_spinbox.valueChanged.connect(self.on_parts_count_changed)
        parts_control_layout.addWidget(self.parts_spinbox)
        parts_control_layout.addStretch()
        parts_layout.addWidget(parts_control)

        self.parts_container = QWidget()
        self.parts_container_layout = QVBoxLayout(self.parts_container)
        self.parts_container_layout.setContentsMargins(0, 5, 0, 0)
        self.parts_container_layout.setSpacing(5)
        parts_layout.addWidget(self.parts_container)

        self.fields["parts_entries"] = []
        form_layout.addWidget(self.parts_frame)

        # ---- Link ünico (soporta Múltiples enlaces principales) ----
        self.single_frame = QFrame()
        self.single_frame.setStyleSheet("QFrame { background-color: #1e1e1e; border-radius: 4px; padding: 8px; margin-top: 5px; }")
        single_layout = QVBoxLayout(self.single_frame)
        single_layout.setContentsMargins(8, 8, 8, 8)
        single_layout.setSpacing(8)
        self.single_frame.hide()

        self.single_links_container = QWidget()
        self.single_links_container_layout = QVBoxLayout(self.single_links_container)
        self.single_links_container_layout.setContentsMargins(0, 0, 0, 0)
        self.single_links_container_layout.setSpacing(8)
        single_layout.addWidget(self.single_links_container)

        add_link_btn = ModernButton("+ Añadir enlace simple", "info")
        add_link_btn.clicked.connect(lambda: self.add_single_link_field())
        single_layout.addWidget(add_link_btn)

        form_layout.addWidget(self.single_frame)

        # Bloquear señales durante la inicialización
        self.check_single.blockSignals(True)
        self.check_parts.blockSignals(True)

        # Eventos toggles
        self.check_single.toggled.connect(self.toggle_download_type)
        self.check_parts.toggled.connect(self.toggle_download_type)
        self.fields["name"].textChanged.connect(self.on_name_changed)

        # Cargar datos (ediciÃ³n)
        if mode == "edit" and game and game.get("downloads"):
            downloads = game["downloads"]
            
            # Buscar partes
            parts_entry = next((d for d in downloads if "parts" in d), None)
            if parts_entry:
                self.check_parts.setChecked(True)
                self.fields["parts_main_text"].setText(parts_entry.get("text", ""))
                p_list = parts_entry.get("parts", [])
                self.parts_spinbox.setValue(len(p_list) or 2)
                # rellenar campos generados
                for i, part in enumerate(p_list):
                    if i < len(self.fields["parts_entries"]):
                        self.fields["parts_entries"][i].setText(part.get("url", ""))

            # Buscar singles
            singles = [d for d in downloads if "parts" not in d]
            if singles:
                self.check_single.setChecked(True)
                for d in singles:
                    self.add_single_link_field(d.get("text", ""), d.get("url", ""), d.get("readMoreText", ""))
            
            # Si no hay nada, por defecto link simple
            if not parts_entry and not singles:
                 self.check_single.setChecked(True)
        else:
            # nuevo: por defecto single
            self.check_single.setChecked(True)
            self.generate_parts_fields(2)

        # Desbloquear señales y actualizar visibilidad
        self.check_single.blockSignals(False)
        self.check_parts.blockSignals(False)
        self.toggle_download_type()

        # Botones
        buttons_container = QWidget()
        buttons_layout = QHBoxLayout(buttons_container)
        buttons_layout.setSpacing(8)
        buttons_layout.setAlignment(Qt.AlignCenter)

        save_text = "Guardar" if mode == "edit" else "Añadir"
        self.save_btn = ModernButton(save_text, "success")
        self.save_btn.clicked.connect(lambda: self.save_game(mode, game))
        buttons_layout.addWidget(self.save_btn)

        cancel_btn = ModernButton("Cancelar", "secondary")
        cancel_btn.clicked.connect(self.cancel_edit)
        buttons_layout.addWidget(cancel_btn)

        form_layout.addWidget(buttons_container)
        form_layout.addStretch()

        scroll.setWidget(container)
        self.right_layout.addWidget(scroll)

    def create_field(self, parent_layout, label_text: str, key: str, default: str = ""):
        container = QWidget()
        layout = QVBoxLayout(container)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(2)

        label = QLabel(label_text)
        label.setStyleSheet("QLabel { color: #aaaaaa; font-size: 10px; }")
        layout.addWidget(label)

        entry = ModernLineEdit()
        entry.setText(default)
        layout.addWidget(entry)

        parent_layout.addWidget(container)
        self.fields[key] = entry

    def add_single_link_field(self, text: str = "", url: str = "", readMoreText: str = ""):
        block = QFrame()
        block.setStyleSheet("QFrame { background-color: #2a2a2a; border-radius: 4px; padding: 6px; }")
        v = QVBoxLayout(block)
        v.setContentsMargins(6, 6, 6, 6)
        v.setSpacing(4)

        header = QWidget()
        h = QHBoxLayout(header)
        h.setContentsMargins(0, 0, 0, 0)
        h.setSpacing(5)

        num = len(self.single_link_entries) + 1
        num_label = QLabel(f"Enlace {num}")
        num_label.setStyleSheet("color: #17a2b8; font-size: 10px; font-weight: bold;")
        h.addWidget(num_label)
        h.addStretch()

        remove_btn = QPushButton("âœ•")
        remove_btn.setFixedSize(20, 20)
        remove_btn.setCursor(Qt.PointingHandCursor)
        remove_btn.setStyleSheet("""
            QPushButton {
                background-color: #d32f2f;
                color: white;
                border: none;
                border-radius: 3px;
                font-size: 12px;
                font-weight: bold;
            }
            QPushButton:hover { background-color: #b71c1c; }
        """)
        remove_btn.clicked.connect(lambda: self.remove_single_link_field(block))
        h.addWidget(remove_btn)

        v.addWidget(header)

        t_label = QLabel("Texto botón:")
        t_label.setStyleSheet("color: #aaaaaa; font-size: 10px;")
        v.addWidget(t_label)

        t_entry = ModernLineEdit()
        if text:
            t_entry.setText(text)
        else:
            game_name = self.fields.get("name").text().strip() if self.fields.get("name") else ""
            if game_name:
                t_entry.setText(f"Descargar {game_name}")
        v.addWidget(t_entry)

        u_label = QLabel("URL:")
        u_label.setStyleSheet("color: #aaaaaa; font-size: 10px;")
        v.addWidget(u_label)

        u_entry = ModernLineEdit()
        u_entry.setText(url)
        v.addWidget(u_entry)

        rm_label = QLabel("Info extra (opcional):")
        rm_label.setStyleSheet("color: #aaaaaa; font-size: 10px;")
        v.addWidget(rm_label)

        rm_entry = QPlainTextEdit()
        rm_entry.setPlaceholderText("Texto adicional para mostrar en Detalles")
        rm_entry.setPlainText(readMoreText)
        rm_entry.setMaximumHeight(80)
        rm_entry.setStyleSheet("""
            QPlainTextEdit {
                background-color: #1e1e1e;
                color: #ffffff;
                border: 1px solid #3a3a3a;
                border-radius: 4px;
                padding: 6px;
                font-size: 11px;
            }
            QPlainTextEdit:focus {
                border: 1px solid #0078d7;
            }
        """)
        v.addWidget(rm_entry)

        self.single_links_container_layout.addWidget(block)
        self.single_link_entries.append({
            "container": block,
            "num_label": num_label,
            "text": t_entry,
            "url": u_entry,
            "readMoreText": rm_entry,
        })
        self.update_single_link_numbers()

    def remove_single_link_field(self, container):
        for i, entry in enumerate(self.single_link_entries):
            if entry["container"] == container:
                self.single_link_entries.pop(i)
                container.deleteLater()
                break
        self.update_single_link_numbers()

    def update_single_link_numbers(self):
        for i, entry in enumerate(self.single_link_entries):
            entry["num_label"].setText(f"Enlace {i + 1}")

    def check_id_exists(self):
        new_id = self.fields["id"].text().strip()
        if not new_id:
            self.id_warning_label.hide()
            if hasattr(self, 'save_btn'):
                self.save_btn.setEnabled(True)
            return
        
        for game in self.games:
            if game["id"] == new_id:
                if self.editing_game_id and self.editing_game_id == new_id:
                    self.id_warning_label.hide()
                    if hasattr(self, 'save_btn'):
                        self.save_btn.setEnabled(True)
                    return
                self.id_warning_label.setText(f"Este ID ya pertenece al juego: {game['name']}")
                self.id_warning_label.show()
                if hasattr(self, 'save_btn'):
                    self.save_btn.setEnabled(False)
                return
        
        self.id_warning_label.hide()
        if hasattr(self, 'save_btn'):
            self.save_btn.setEnabled(True)

    def on_name_changed(self):
        game_name = self.fields["name"].text().strip()

        # Auto-relleno primer enlace si parece vacÃ­o o default
        if self.check_single.isChecked() and game_name and self.single_link_entries:
            first = self.single_link_entries[0]
            cur = first["text"].text().strip()
            if not cur or cur.startswith("Descargar "):
                first["text"].setText(f"Descargar {game_name}")

        # Auto-relleno texto principal de partes
        if self.check_parts.isChecked() and game_name and self.fields.get("parts_main_text"):
            cur = self.fields["parts_main_text"].text().strip()
            if not cur or cur.startswith("Descargar "):
                self.fields["parts_main_text"].setText(f"Descargar {game_name}")

    def toggle_download_type(self):
        if self.check_single.isChecked():
            self.single_frame.show()
            if not self.single_link_entries:
                self.add_single_link_field()
        else:
            self.single_frame.hide()
            
        if self.check_parts.isChecked():
            self.parts_frame.show()
            if not self.fields.get("parts_entries"):
                self.generate_parts_fields(self.parts_spinbox.value())
        else:
            self.parts_frame.hide()

    def on_parts_count_changed(self, value: int):
        self.generate_parts_fields(value)

    def generate_parts_fields(self, count: int):
        # Guardar valores existentes
        current_values = [e.text() for e in self.fields.get("parts_entries", [])]

        # Limpiar
        for entry in self.fields.get("parts_entries", []):
            parent = entry.parent()
            if parent:
                parent.deleteLater()
        self.fields["parts_entries"] = []

        # Crear
        for i in range(count):
            part_container = QWidget()
            part_layout = QVBoxLayout(part_container)
            part_layout.setContentsMargins(0, 0, 0, 0)
            part_layout.setSpacing(2)

            label = QLabel(f"Parte {i + 1}:")
            label.setStyleSheet("color: #888888; font-size: 10px;")
            part_layout.addWidget(label)

            entry = ModernLineEdit()
            if i < len(current_values):
                entry.setText(current_values[i])
            part_layout.addWidget(entry)

            self.parts_container_layout.addWidget(part_container)
            self.fields["parts_entries"].append(entry)

    def cancel_edit(self):
        self.show_placeholder()

    def save_game(self, mode: str, original_game=None):
        name = self.fields["name"].text().strip()
        game_id = self.fields["id"].text().strip()
        img = self.fields["img"].text().strip()

        if not name or not game_id or not img:
            QMessageBox.warning(self, "Error", "Nombre, ID y Portada son obligatorios")
            return

        if mode == "add" or (original_game and original_game["id"] != game_id):
            if any(g["id"] == game_id for g in self.games):
                QMessageBox.warning(self, "Error", f"Ya existe un juego con ID '{game_id}'")
                return

        downloads = []

        # 1. Partes (prioridad visual)
        if self.check_parts.isChecked():
            main_text = self.fields["parts_main_text"].text().strip()
            if not main_text:
                main_text = f"Descargar {name}"

            parts = []
            for i, entry in enumerate(self.fields.get("parts_entries", [])):
                url = entry.text().strip()
                if url: # Solo incluir partes con URL? o todas? Mejor todas si el usuario puso el campo.
                     parts.append({"text": f"Parte {i + 1}", "url": url})
            
            # Solo Añadir si hay partes
            if parts:
                downloads.append({"text": main_text, "parts": parts})
            else:
                # Si activÃ³ checkbox pero no puso partes, advertir o ignorar?
                pass

        # 2. Singles (actualizaciones, juego completo un link, etc)
        if self.check_single.isChecked():
            for entry in self.single_link_entries:
                btn_text = entry["text"].text().strip()
                btn_url = entry["url"].text().strip()
                btn_readmore = entry["readMoreText"].toPlainText().strip() if entry.get("readMoreText") else ""
                if btn_text and btn_url:
                    dl_item = {"text": btn_text, "url": btn_url}
                    if btn_readmore:
                        dl_item["readMoreText"] = btn_readmore
                    downloads.append(dl_item)

        if not downloads:
            QMessageBox.warning(self, "Error", "Debes configurar al menos una opciÃ³n de descarga vÃ¡lida (Partes o Enlace Simple).")
            return

        new_game = {"id": game_id, "name": name, "img": img, "downloads": downloads}

        try:
            if mode == "add":
                success = self.add_game_to_files(new_game)
                if success:
                    self.games.append(new_game)
            else:
                success = self.update_game_in_files(original_game, new_game)
                if success:
                    idx = self.games.index(original_game)
                    self.games[idx] = new_game

            if success:
                self.games.sort(key=lambda x: x["name"].lower())
                self.refresh_game_list()
                self.update_game_count()
                self.cancel_edit()

        except Exception as e:
            QMessageBox.critical(self, "Error", f"Error al guardar:\n{str(e)}")

    # -------------------- JS helpers (parse/replace full block) --------------------

    def _extract_game_download_links_block(self, js_content: str):
        m = re.search(r"const\s+gameDownloadLinksData\s*=\s*\{(.*?)\n\s*\};", js_content, flags=re.DOTALL)
        if not m:
            return None
        return m

    def _infer_base_indent(self, block: str) -> str:
        prefixes = []
        for line in block.splitlines():
            lm = re.match(r"^(\s+)'[^']+':", line)
            if lm:
                prefixes.append(lm.group(1))
        if prefixes:
            norm = [p.replace("\t", "    ") for p in prefixes]
            most_common_len = Counter([len(p) for p in norm]).most_common(1)[0][0]
            return " " * most_common_len
        return "        "

    def _scan_entries(self, s: str):
        """Devuelve lista de (key, valueArrayString) dentro del bloque { ... }"""
        i, n = 0, len(s)
        out = []

        def skip_ws(idx: int) -> int:
            while idx < n and s[idx] in " \t\r\n":
                idx += 1
            return idx

        while i < n:
            i = skip_ws(i)
            if i >= n:
                break
            if s[i] != "'":
                i += 1
                continue

            # leer key string
            j = i + 1
            while j < n:
                if s[j] == "\\" and j + 1 < n:
                    j += 2
                    continue
                if s[j] == "'":
                    break
                j += 1
            if j >= n:
                break

            key = s[i + 1:j]
            k = skip_ws(j + 1)
            if k >= n or s[k] != ":":
                i = j + 1
                continue

            k = skip_ws(k + 1)
            if k >= n or s[k] != "[":
                i = k
                continue

            start_val = k
            depth = 0
            in_str = False
            str_q = None
            esc = False
            k2 = k

            while k2 < n:
                ch = s[k2]
                if in_str:
                    if esc:
                        esc = False
                    elif ch == "\\":
                        esc = True
                    elif ch == str_q:
                        in_str = False
                        str_q = None
                    k2 += 1
                    continue

                if ch in ("'", '"'):
                    in_str = True
                    str_q = ch
                    k2 += 1
                    continue

                if ch == "[":
                    depth += 1
                elif ch == "]":
                    depth -= 1
                    if depth == 0:
                        k2 += 1
                        break
                k2 += 1

            end_val = k2
            value = s[start_val:end_val]

            k3 = skip_ws(end_val)
            if k3 < n and s[k3] == ",":
                k3 += 1

            out.append((key, value))
            i = k3

        return out

    def _scan_list_items(self, s: str) -> list[str]:
        """Escanea items de una lista JS [item1, item2, ...] manejando anidamiento bÃ¡sico."""
        items = []
        n = len(s)
        i = 0

        def skip_ws(idx):
            while idx < n and s[idx] in " \t\r\n":
                idx += 1
            return idx

        start_item = None
        depth_sq = 0  # []
        depth_curly = 0  # {}
        in_str = False
        str_q = None
        esc = False

        while i < n:
            ch = s[i]
            
            if start_item is None:
                if ch not in " \t\r\n,": # Start of an item
                    start_item = i
            
            if start_item is not None:
                if in_str:
                    if esc:
                        esc = False
                    elif ch == "\\":
                        esc = True
                    elif ch == str_q:
                        in_str = False
                        str_q = None
                else:
                    if ch in ("'", '"'):
                        in_str = True
                        str_q = ch
                    elif ch == "[":
                        depth_sq += 1
                    elif ch == "]":
                        depth_sq -= 1
                    elif ch == "{":
                        depth_curly += 1
                    elif ch == "}":
                        depth_curly -= 1
                    elif ch == "," and depth_sq == 0 and depth_curly == 0:
                        # End of item
                        items.append(s[start_item:i].strip())
                        start_item = None
            
            i += 1
        
        # Last item
        if start_item is not None:
            val = s[start_item:].strip()
            if val:
                items.append(val)
        
        return items

    def _parse_entry_to_game(self, key: str, value: str):
        # value es el contenido del array: [{...}, {...}] o [{...}]
        # Eliminamos corchetes externos si existen (pero el regex scan_entries ya trae el contenido interno si no me equivoco? 
        # Revisando _scan_entries: "value = s[start_val:end_val]" donde start_val/end_val son corchetes.
        # SI el value incluye los corchetes [], debemos quitarlos.
        
        content = value.strip()
        if content.startswith("[") and content.endswith("]"):
            content = content[1:-1]
        
        items = self._scan_list_items(content)
        downloads = []

        for item in items:
            # Detectar si es parte o link simple
            if "parts:" in item:
                # Es un objeto compuesto
                tm = re.search(r"text\s*:\s*'((?:\\.|[^'])*)'", item)
                main_text = self.js_unescape(tm.group(1)) if tm else ""
                
                parts_arr_m = re.search(r"parts\s*:\s*\[(.*)\]", item, flags=re.DOTALL)
                parts = []
                if parts_arr_m:
                    parts_content = parts_arr_m.group(1)
                    # Usamos regex simple para las partes internas ya que son simples {text, url}
                    for pt, pu in re.findall(r"\{\s*text\s*:\s*'((?:\\.|[^'])*)',\s*url\s*:\s*'((?:\\.|[^'])*)'\s*\}", parts_content):
                        parts.append({"text": self.js_unescape(pt), "url": self.js_unescape(pu)})
                
                downloads.append({"text": main_text, "parts": parts})
            else:
                # Es un link simple { text:..., url:..., readMoreText:... }
                tm = re.search(r"text\s*:\s*'((?:\\.|[^'])*)'", item)
                um = re.search(r"url\s*:\s*'((?:\\.|[^'])*)'", item)
                rm = re.search(r"readMoreText\s*:\s*'((?:\\.|[^'])*)'", item)
                if tm and um:
                    dl_item = {
                        "text": self.js_unescape(tm.group(1)),
                        "url": self.js_unescape(um.group(1))
                    }
                    if rm:
                        dl_item["readMoreText"] = self.js_unescape(rm.group(1))
                    downloads.append(dl_item)

        return {"id": self.js_unescape(key), "downloads": downloads}

    def _render_block_from_games(self, games, base_indent: str) -> str:
        entries = []
        for g in games:
            entries.append(self.format_js_entry(g, base_indent=base_indent))
        if not entries:
            return "\n"
        # Separar por coma + salto de lÃ­nea, sin coma final
        return "\n" + ",\n".join(entries) + "\n"

    def _parse_game_download_links_data(self, js_content: str):
        m = self._extract_game_download_links_block(js_content)
        if not m:
            return {}
        block = m.group(1)
        entries = self._scan_entries(block)
        out = {}
        for key, value in entries:
            game = self._parse_entry_to_game(key, value)
            out[game["id"]] = game.get("downloads", [])
        return out

    def _update_game_download_links_data_block(self, js_content: str, op: str, new_game=None, old_id=None):
        m = self._extract_game_download_links_block(js_content)
        if not m:
            raise Exception("No se encontrÃ³ gameDownloadLinksData en index.js")

        block = m.group(1)
        base_indent = self._infer_base_indent(block)

        entries = self._scan_entries(block)
        parsed_games = [self._parse_entry_to_game(k, v) for k, v in entries]

        if op == "add":
            if any(g["id"] == new_game["id"] for g in parsed_games):
                raise Exception(f"Ya existe una entrada en index.js con id '{new_game['id']}'")
            parsed_games.append({"id": new_game["id"], "downloads": new_game.get("downloads", [])})

        elif op == "update":
            if old_id is None:
                raise Exception("old_id es requerido para update")
            idx = next((i for i, g in enumerate(parsed_games) if g["id"] == old_id), None)
            if idx is None:
                # si no existe, lo tratamos como add
                parsed_games.append({"id": new_game["id"], "downloads": new_game.get("downloads", [])})
            else:
                parsed_games[idx] = {"id": new_game["id"], "downloads": new_game.get("downloads", [])}

        elif op == "delete":
            if old_id is None:
                raise Exception("old_id es requerido para delete")
            parsed_games = [g for g in parsed_games if g["id"] != old_id]

        else:
            raise Exception("Operación JS invÃ¡lida")

        new_block = self._render_block_from_games(parsed_games, base_indent)
        start, end = m.span(1)
        return js_content[:start] + new_block + js_content[end:]

    # -------------------- JS formatting --------------------

    def format_js_entry(self, game, base_indent: str = "        "):
        base = base_indent
        ind1 = base + "    "
        ind2 = base + "        "
        ind3 = base + "            "

        downloads = game.get("downloads") or []
        game_id = self.js_escape(game["id"])

        if not downloads:
             return f"{base}'{game_id}': []"

        lines = [f"{base}'{game_id}': ["]
        
        for i, d in enumerate(downloads):
            comma = "," if i < len(downloads) - 1 else ""
            
            if "parts" in d:
                # Es compuesto
                main_text = self.js_escape(d.get("text", ""))
                parts = d.get("parts", [])
                
                lines.append(f"{ind1}{{")
                lines.append(f"{ind2}text: '{main_text}',")
                lines.append(f"{ind2}parts: [")
                
                for j, p in enumerate(parts):
                    p_comma = "," if j < len(parts) - 1 else ""
                    pt = self.js_escape(p.get("text", ""))
                    pu = self.js_escape(p.get("url", ""))
                    lines.append(f"{ind3}{{ text: '{pt}', url: '{pu}' }}{p_comma}")
                
                lines.append(f"{ind2}]")
                lines.append(f"{ind1}}}{comma}")
            else:
                # Es simple
                t = self.js_escape(d.get("text", ""))
                u = self.js_escape(d.get("url", ""))
                rm = d.get("readMoreText", "")
                if rm:
                    rm_escaped = self.js_escape(rm)
                    lines.append(f"{ind1}{{ text: '{t}', url: '{u}', readMoreText: '{rm_escaped}' }}{comma}")
                else:
                    lines.append(f"{ind1}{{ text: '{t}', url: '{u}' }}{comma}")

        lines.append(f"{base}]")
        return "\n".join(lines)

    # -------------------- File operations --------------------

    def add_game_to_files(self, game):
        try:
            # HTML
            with open(self.html_file, "r", encoding="utf-8") as f:
                html_content = f.read()

            last_item_pattern = r'(<a[^>]*class=\"game-item\"[^>]*>.*?</a>)(?!.*<a[^>]*class=\"game-item\")'
            new_html_item = (
                f'<a href="#" data-game-id="{game["id"]}" class="game-item">\n'
                f'        <img src="{game["img"]}" loading="lazy">\n'
                f'        <p>{game["name"]}</p>\n'
                f'    </a>'
            )
            html_content = re.sub(last_item_pattern, r"\1\n    " + new_html_item, html_content, flags=re.DOTALL)

            with open(self.html_file, "w", encoding="utf-8") as f:
                f.write(html_content)

            # JS
            with open(self.js_file, "r", encoding="utf-8") as f:
                js_content = f.read()

            js_content = self._update_game_download_links_data_block(js_content, op="add", new_game=game)

            with open(self.js_file, "w", encoding="utf-8") as f:
                f.write(js_content)

            return True

        except Exception as e:
            raise Exception(f"Error al Añadir juego: {str(e)}")

    def update_game_in_files(self, old_game, new_game):
        try:
            # HTML
            with open(self.html_file, "r", encoding="utf-8") as f:
                html_content = f.read()

            old_pattern = rf'<a[^>]*data-game-id=\"{re.escape(old_game["id"])}\"[^>]*class=\"game-item\"[^>]*>\s*<img[^>]*src=\"[^\"]*\"[^>]*>\s*<p>[^<]+</p>\s*</a>'
            new_html_item = (
                f'<a href="#" data-game-id="{new_game["id"]}" class="game-item">\n'
                f'        <img src="{new_game["img"]}" loading="lazy">\n'
                f'        <p>{new_game["name"]}</p>\n'
                f'    </a>'
            )
            html_content = re.sub(old_pattern, new_html_item, html_content, flags=re.DOTALL)

            with open(self.html_file, "w", encoding="utf-8") as f:
                f.write(html_content)

            # JS
            with open(self.js_file, "r", encoding="utf-8") as f:
                js_content = f.read()

            js_content = self._update_game_download_links_data_block(
                js_content,
                op="update",
                new_game=new_game,
                old_id=old_game["id"],
            )

            with open(self.js_file, "w", encoding="utf-8") as f:
                f.write(js_content)

            return True

        except Exception as e:
            raise Exception(f"Error al actualizar juego: {str(e)}")

    def delete_game_from_files(self, game, silent: bool = False):
        try:
            # HTML
            with open(self.html_file, "r", encoding="utf-8") as f:
                html_content = f.read()

            pattern = rf'<a[^>]*data-game-id=\"{re.escape(game["id"])}\"[^>]*>.*?</a>\s*'
            html_content = re.sub(pattern, "", html_content, flags=re.DOTALL)

            with open(self.html_file, "w", encoding="utf-8") as f:
                f.write(html_content)

            # JS
            with open(self.js_file, "r", encoding="utf-8") as f:
                js_content = f.read()

            js_content = self._update_game_download_links_data_block(js_content, op="delete", old_id=game["id"])

            with open(self.js_file, "w", encoding="utf-8") as f:
                f.write(js_content)

            return True

        except Exception as e:
            if not silent:
                raise Exception(f"Error al eliminar juego: {str(e)}")
            return False


if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    window = GameManagerApp()
    window.show()
    sys.exit(app.exec())